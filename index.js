let globalAccessToken;
let globalChallengeID;

function modifyAccessToken(newTokenAccess) {
    globalAccessToken = newTokenAccess;
}

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
        let apiURL = "http://localhost:3000/challenge"
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

            let globalChallengeID = data;

            if (currentType == "LDAP") {
                window.location.assign("QRAuthenticationPage.html");
                const resultDiv = document.getElementById("result");
            
            } else if (currentType == "USERPASS") {
                const resultDiv = document.getElementById("result");
                send_sms_to_mobile();
                window.location.assign("SMSVerificationPage.html");
            }
        } else {
            const error = await response.text();
            console.log("Error " + response.status + " " + error )
        }
        
    } catch (error) {
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the request to localHost: ${error.message}</p>`
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
        let apiURL = "http://localhost:3000/handle_QR_authentication"
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

        console.log("Request to localHost handle_QR_authentication was sent successfully.")

        if (response.status == 200) {
            console.log("QR Authentication Successful.")
            successful_login_page();
            
        } else {
            console.log("QR Authentication unsuccessful.")
            const error = await response.text();
            console.log("Error " + response.status + " " + error )
            const resultDiv = document.getElementById("result")
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;"> ${error}</p>`;
            return;
        }
    } catch (error) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the request to localHost: ${error.message}</p>`
        console.log("Catched error: " + error)
    }
}

async function send_sms_to_mobile() {   
    const resultDiv = document.getElementById("result");

    try {
        let apiURL = "http://localhost:3000/send_sms_to_mobile"
        const response = await fetch (apiURL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                challengeID: globalChallengeID
            })
        })

        console.log("Request to localHost send_sms_to_mobile was sent successfully.")

        if (response.status == 200) {
            console.log("SMS sent successfully.")
            
        } else {
            console.log("SMS wasnt sent successfully.")
            const error = await response.text();
            console.log("Error " + response.status + " " + error )
            return;
        }
        
    } catch (error) {
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the request to localHost: ${error.message}</p>`
        }
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
        let apiURL = "http://localhost:3000/handle_SMS_verification"
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
            successful_login_page();
            
        } else {
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Verification failed. Try again.</p>`
            console.error("Verification failed.")
            const error = await response.text();
            console.log("Error " + response.status + " " + error )
            return;
        }
        
    } catch (error) {
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the request to localHost: ${error.message}</p>`
        }
        console.log("Catched error: " + error)
    }
}

function successful_login_page() {
    window.location.assign("successfulLoginPage.html");
    get_access_token();
}

async function get_access_token() {
    try {
        let apiURL = "http://localhost:3000/get_access_token"
        const response = await fetch (apiURL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        })

        console.log("Request to localHost get_access_token was sent successfully.")

        if (response.status == 200) {
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Acccess token updated.</p>`
            console.log("Acccess token updated.")
            modifyAccessToken(response.text())
    
            // what to do next
        } else {
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Getting access token failed. Try again.</p>`
            console.error("Getting access token failed.")
            const error = await response.text();
            console.log("Error " + response.status + " " + error )
            return;
        }
        
    } catch (error) {
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the request to localHost: ${error.message}</p>`
        }
        console.log("Catched error: " + error)
    }
}

async function send_token() {
    accessToken = globalAccessToken

    try {
        let apiURL = "http://localhost:3000/addToken"
        const response = await fetch (apiURL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accessToken: accessToken
            })
        })
        console.log("Request for updating token was sent successfully.")

        const data = await response.text();
        console.log(data)
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">${data}</p>`

    } catch (error) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the token to DB: ${error.message}</p>`
        console.log("Catched error: " + error)
    }    
}
