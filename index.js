let newAccessToken = ""

async function challenge() {

    const resultDiv = document.getElementById("result")

    currentUsername = document.getElementById("username").value;
    currentPassword = document.getElementById("password").value;
    currentAuthType = document.getElementById("authTypeDropDown").value;
    currentType = document.getElementById("typeDropDown").value;

    userErrorDiv = document.getElementById("userError");
    passwordErrorDiv = document.getElementById("passwordError");
    
    if (currentUsername.length == 0) {
        userErrorDiv.innerHTML = `<p style="color: red; font-size: 14px;">!نام کاربری اجباری است</p>`
        return;
    } else {
        userErrorDiv.innerHTML = ''
    }

    if (currentPassword.length == 0) {
        passwordErrorDiv.innerHTML = `<p style="color: red; font-size: 14px;">!گذرواژه اجباری است</p>`
        console.log("Entering Password is mandatory.")
        return;
    } else if (currentPassword.length < 8) {
        passwordErrorDiv.innerHTML = `<p style="color: red; font-size: 14px;">!گذرواژه حداقل 8 کاراکتر مجاز دارد</p>`
        console.log("Password must atleast have 8 characters.")
        return;
    } else {
        passwordErrorDiv.innerHTML = ''
    }

    const dataSending = {
        username: currentUsername,
        password: currentPassword,
        type: currentType,  //"USERPASS", LDAP
        authType: currentAuthType  //"MOBILE", QR
    };

    try {
        let apiURL = "http://localhost:4000/challenge"
        const response = await fetch (apiURL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataSending)
        })

        console.log("Request to localHost Challenge was sent successfully.")

        if (response.status == 200) {
            const data = await response.text();

            console.log("New Challenge ID: " + data)

            const globalChallengeID = data;

            if (currentType == "LDAP") {
                window.location.assign("QRAuthenticationPage.html?challengeID=" + encodeURIComponent(globalChallengeID));
            } else if (currentType == "USERPASS") {
                window.location.assign("SMSVerificationPage.html?challengeID=" + encodeURIComponent(globalChallengeID));
            }
        } else {
            const error = await response.text();
            console.log("Error " + response.status + " " + error )
            const resultDiv = document.getElementById("result");
            if (resultDiv) {
                resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error ${response.status} ${error}</p>`
            }
        }
        
    } catch (error) {
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in the request sending to Local Server: ${error.message}</p>`
        }
        console.log("Catched error: " + error)
    }  
}

async function send_sms_to_mobile() {   
    console.log("entered send sms to mobile.")
    const resultDiv = document.getElementById("result");

    try {
        const params = new URLSearchParams(window.location.search);
        const globalChallengeID = params.get("challengeID");
    
        console.log("Global:" + globalChallengeID) //why is this null?

        let apiURL = "http://localhost:4000/send_sms_to_mobile"
        const response = await fetch (apiURL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                challengeID: globalChallengeID
            })
        })

        console.log("Request to Local Server send_sms_to_mobile was sent successfully.")

        if (response.status == 200) {
            console.log("SMS sent successfully.")
            
        } else {
            console.log("SMS wasnt sent successfully.")
            const error = await response.text();
            console.log("Error " + response.status + " " + error )
            const resultDiv = document.getElementById("result");
            if (resultDiv) {
                resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error ${response.status} ${error}</p>`
            }
            return;
        }
        
    } catch (error) {
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the request to Local Server sending sms to mobile: ${error.message}</p>`
        }
        console.log("Catched error: " + error)
    }
}

async function handle_QR_authentication() {

    const resultDiv = document.getElementById("result")
    const authenticationCode = document.getElementById("authenticationCode").value;

    if (authenticationCode.length == 0) {
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">!وارد کردن کد اجباری است</p>`;
        return;
    } else if (authenticationCode.length < 6) {
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">!کد باید 4 رقمی باشد</p>`;
        return;
    }

    try {
        const params = new URLSearchParams(window.location.search);
        const globalChallengeID = params.get("challengeID");

        let apiURL = "http://localhost:4000/handle_QR_authentication"
        const response = await fetch (apiURL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                authenticationCode: authenticationCode,
                challengeID: globalChallengeID
            })
        })

        console.log("Request to Local Server handle_QR_authentication was sent successfully.")

        if (response.status == 200) {
            console.log("QR Authentication Successful.")
            window.location.assign("successfulLoginPage.html?challengeID=" + encodeURIComponent(globalChallengeID));
            
        } else {
            console.log("QR Authentication unsuccessful.")
            const error = await response.text();
            console.log("Error " + response.status + " " + error )
            const resultDiv = document.getElementById("result");
            if (resultDiv) {
                resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error ${response.status} ${error}</p>`
            }
            return;
        }
    } catch (error) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the request to Local Server QR Authentication: ${error.message}</p>`
        console.log("Catched error: " + error)
    }
}

async function handle_SMS_verification() { 
    const verificationCode = document.getElementById("verificationCode").value;

    if (verificationCode.length == 0) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">!وارد کردن کد اجباری است</p>`;
        return;
    } else if (verificationCode.length < 4) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">!کد باید 4 رقمی باشد</p>`;
        return;
    }

    try {
        const params = new URLSearchParams(window.location.search);
        const globalChallengeID = params.get("challengeID");

        let apiURL = "http://localhost:4000/handle_SMS_verification"
        const response = await fetch (apiURL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                verificationCode: verificationCode,
                challengeID: globalChallengeID
            })
        })

        console.log("Request to localHost handle_SMS_verification was sent successfully.")

        if (response.status == 200) {
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Verification successful!</p>`
            console.log("Verification Successful.")

            window.location.assign("successfulLoginPage.html?challengeID=" + encodeURIComponent(globalChallengeID));
        
        } else {
            const resultDiv = document.getElementById("result");
            console.error("Verification failed.")
            const error = await response.text();
            console.log("Error " + response.status + " " + error )
            if (resultDiv) {
                resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Verification failed ${response.status} ${error}</p>`
            }
            return;
        }
        
    } catch (error) {
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the request to Local Server in SMS Verification: ${error.message}</p>`
        }
        console.log("Catched error: " + error)
    }
}

async function get_access_token() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<p style="color: blue; font-size: 18px;">Updating Access token ...</p>`;

    // try {
    //     let apiURL = "http://localhost:4000/get_access_token"
    //     const response = await fetch (apiURL , {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({})
    //     })

    //     console.log("Request to Local Server get_access_token was sent successfully.")

    //     if (response.status == 200) {
    //         const resultDiv = document.getElementById("result");
    //         resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Access token updated.</p>`
    //         console.log("Access token updated.")
    //         newAccessToken = response.text()
    //     } else {
    //         console.error("Getting access token failed.")
    //         const error = await response.text();
    //         console.log("Error " + response.status + " " + error )
    //         const resultDiv = document.getElementById("result");
    //         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Getting access token failed. ${response.status} ${error}</p>`
    //     }
        
    // } catch (error) {
    //     const resultDiv = document.getElementById("result");
    //     if (resultDiv) {
    //         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the request to Local Server (for getting access token): ${error.message}</p>`
    //     }
    //     console.log("Catched error: " + error)
    // }
}

async function send_token() {
    const hardCodedAccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ZWVkYTJlNi00M2EwLTQ4ZDUtOGRiMi1hYWRlMjExYjQ0ZWIiLCJleHAiOjE3NTI5MTc3NTksImlhdCI6MTc1MjMxMjk1OSwibmJmIjoxNzUyMzEyOTU5LCJqdGkiOiJmMDNjOGIwYy1kMDU5LTRkODAtOGYxMS1jMTBhOWQ1YTBmMzAiLCJyb2xlcyI6WyJ1c2VyIl0sInNjb3BlcyI6WyJyZXBvcnQ6cmVhZCIsInJlcG9ydDp3cml0ZSIsInRlbXBsYXRlOnJlYWQiLCJ0ZW1wbGF0ZTp3cml0ZSJdfQ.jnhA0NsbDwWdCkGspQZmMib8QHvEygbQ25Ut_nkWFHHt_BMIWKqlhWhrf2C6_-OWBe7KoCuR8ffkVoHiuqHh_De-gisJrweDfJc2pY093M-syiyc8592BSEszoe4S5N3q3XaXZ9Hbm1SR7Qj_HufAM8SlZYig10J8w6Dv9X4zVKFKtvx_Zfg9yDE_mJG1eY6mt1W7S6i-lv8dN0HnOb46xKttm_jf3vUVall8fAd_FgqezuEuUOkEJQfznduLqzwr76VrlxQJGERX6KEotp34dv9hHay7c9-hVABCDmmAgmH-y9l40v5DM5x0fVf5ntMvSlvPNxe0c-r9BnjtUuPbA"
    const resultDiv = document.getElementById("result");
    if (resultDiv) {
        resultDiv.innerHTML = `<p style="color: blue; font-size: 18px;">Sending token to database...</p>`
    }

    try {
        let apiURL = "http://localhost:4000/addTokenToDB"
        const response = await fetch (apiURL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newAccessToken: hardCodedAccessToken
            })
        })
        console.log("Request for updating token was sent successfully.")

        if (response.status == 200) {
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Data was sent successfully.</p>`
        } else {
            const responseBody = response.text()
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Sending the token to DB was unsuccessful: ${responseBody}.</p>`
        }
        
    } catch (error) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the token to DB: ${error.message}</p>`
        console.log("Catched error: " + error)
    }    
}