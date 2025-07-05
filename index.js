function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function clickLoginButton() {
    challenge();
}

async function challenge() {

    const resultDiv = document.getElementById("result")
    send_token()

    // currentUsername = document.getElementById("username").value;
    // currentPassword = document.getElementById("password").value;
    // currentAuthType = document.getElementById("authTypeDropDown").value;
    // currentType = document.getElementById("typeDropDown").value;

    // userErrorDiv = document.getElementById("userError");
    // passwordErrorDiv = document.getElementById("passwordError");

    // if (currentUsername.length == 0) {
    //     userErrorDiv.innerHTML = `<p style="color: red; font-size: 14px;">!نام کاربری اجباری است</p>`
    //     return;
    // } else {
    //     userErrorDiv.innerHTML = ''
    // }

    // if (currentPassword.length == 0) {
    //     passwordErrorDiv.innerHTML = `<p style="color: red; font-size: 14px;">!گذرواژه اجباری است</p>`
    //     console.log("Entering Password is mandatory.")
    //     return;
    // } else if (currentPassword.length < 8) {
    //     passwordErrorDiv.innerHTML = `<p style="color: red; font-size: 14px;">!گذرواژه حداقل 8 کاراکتر مجاز دارد</p>`
    //     console.log("Password must atleast have 8 characters.")
    //     return;
    // } else {
    //     passwordErrorDiv.innerHTML = ''
    // }

//     const dataSending = {
//         username: currentUsername,
//         password: currentPassword,
//         type: currentType,  //"USERPASS", LDAP
//         authType: currentAuthType  //"MOBILE", QR
//     };

//     try {
//         const apiURL = "http://172.16.20.173/api/v1/authentication/login/challenge"
        
//         const response = await fetch(apiURL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(dataSending)
//         })

//         if (!response.ok) {
//             console.log("response is not ok")

//             responseBody = await response.text()
//             resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ ${responseBody}</p>`
//             console.log("Response body:", responseBody); //{"detail":"automatic bind not successful - invalidCredentials"}
//             // const errorMessage = responseBody.errors[0].msg
//             // console.log(errorMessage)
             
//             //////////////inja bauad dorost she beporsam

//             return;

//         } else {
//             console.log("response is ok")
//             const data = await response.json();
            
//             if (JSON.stringify(data.id)) {
//                 console.log("Challenge Successful!!");

//                 document.cookie = "challengeID=" + JSON.stringify(data.id);

//                 if (currentType == "LDAP") {
//                     QR_verification_page();
//                 } else if (currentType == "USERPASS") {
//                     SMS_verification_page();
//                 }

//             } else if (JSON.stringify(data.errors)) {
//                 resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error!! ${JSON.stringify(data.errors[0].msg)}</p>`;
//                 console.error("Error!!");
//                 return;
//             }
//         }

//     } catch (error) {
//         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Network or JavaScript Error! : ${error.message}</p>`;
//         console.error("Error catched: " + errorMessage);
//         return;
//     }
// }

// function QR_verification_page() {
//     const resultDiv = document.getElementById("result");
//     window.location.assign("QRAuthenticationPage.html");
// }

// async function handle_QR_authentication() {

//     const resultDiv = document.getElementById("result")

//     try {
//         const authenticationCode = document.getElementById("authenticationCode").value;

//         if (authenticationCode.length == 0) {
//             resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">!وارد کردن کد اجباری است</p>`;
//             return;
//         } else if (authenticationCode.length < 6) {
//             resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">!کد باید 4 رقمی باشد</p>`;
//             return;
//         }

//         const rawChallengeID = getCookie("challengeID");
//         const challengeID = rawChallengeID.replace(/^"|"$/g, '');

//         const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeID}/totp/verify`;

//         const response = await fetch(apiURL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 code: authenticationCode
//             })
//         })

//         if (!response.ok) {
//             console.log("response not ok.")

//             responseBody = await response.text()
//             resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ ${responseBody}</p>`
//             console.log("Response body:", responseBody);
//             // const errorMessage = responseBody.errors[0].msg
//             // console.log(errorMessage)
             
//             //////////////inja bauad dorost she beporsam

//         } else {
//             console.log("response is ok.")

//             const data = await response.json();

//             resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Successful! ${JSON.stringify(data)}}</p>`;
//             console.log("Successful: " + JSON.stringify(data));

//             if (data.message === "Successful") {

//                 resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Authentication successful!</p>`
//                 console.log("QR Authentication Successful.")

//                 successful_login_page();
                
//             } else {
//                 resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Authentication failed. Try again.</p>`
//                 console.log("QR Authentication unsuccessful.")
//             }
//         }
//     }

//     catch(error) {
//         const resultDiv = document.getElementById("result");
//         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error catched: ${error.message}</p>`
//         console.log("Error catched: " + error.message)
//     }
}

function SMS_verification_page() {
    let resultDiv = document.getElementById("result");

    window.location.assign("SMSVerificationPage.html")

    send_sms_to_mobile();

    count_down();

    let resultDiv2 = document.getElementById("result2");
    if (resultDiv2){
        resultDiv2.innerHTML = getCookie("mobile"); 
    }
}

async function send_sms_to_mobile() {
    
    const rawChallengeID = getCookie("challengeID");
    const challengeID = rawChallengeID.replace(/^"|"$/g, '');
    
    if (!challengeID) {
        console.error("No challengeID found!");
        return;
    }
    
    let resultDiv = document.getElementById("result");

    console.log("Challenge ID: " + challengeID)

    try {
        const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeID}/mobile`;
        
        console.log(apiURL)

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": challengeID
            })
        })

        const data = await response.json();

        if (!response.ok) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;"> response is not ok. ${response}</p>`;
            console.log("Sending sms to mobile's Response is not OK.")
        }

        resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Successful! ${JSON.stringify(data)}}</p>`;
        console.log("Sending SMS to mobile was successful!")

        document.cookie = "mobile=" + data.mobile;
        document.cookie = "expires_in=" + data.expires_in;

        let resultDiv2 = document.getElementById("result2");
        resultDiv2.innerHTML = data.mobile
        console.log(data.mobile)
    }

    catch(error) {
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error catched. Reason: (${(error.Message)})</p>`;
        console.log("Sending SMS to mobile: Error catched. " + error)
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

    const rawChallengeID = getCookie("challengeID");
    const challengeID = rawChallengeID.replace(/^"|"$/g, '');
    
    if (!challengeID) {
        console.error("No challenge ID found!");
        return;
    }

    try {
        const resultDiv = document.getElementById("result");
        const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeID}/mobile/verify`;

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: verificationCode
            })
        })

        if (!response.ok) {

            responseBody = await response.text()
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ ${responseBody}</p>`
            console.log("Response body:", responseBody);  //
            // const errorMessage = responseBody.errors[0].msg
            // console.log(errorMessage)
             
            //////////////inja bauad dorost she beporsam

        } else {
            const data = await response.json();

            if (resultDiv) {
                if (data.message === "Successful") {
                    resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Verification successful!</p>`
                    console.log("Verification Successful.")
                    this.successful_login_page();
                    
                } else {
                    resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Verification failed. Try again.</p>`
                    console.error("Verification failed.")
                    return;
                }
            } else {
                console.error("Error: 'result' div not found!");
                return;
            }
        }
    }

    catch(error) {
        let resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error verifying code. ${error.message}</p>`
        console.log("Catched error in sms verification: " + error.message)
    }
}

function successful_login_page() {
    window.location.assign("pages/successfulLoginPage.html");
    get_access_token();
}

async function get_access_token() {

    try {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: blue; font-size: 18px;">...در حال بررسی دسترسی</p>`

        const apiURL = `http://172.16.20.173/api/v1/authentication/login/access-token`;

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({}) // empty
        })

        const data = await response.json();

        if (!response.ok) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;"> response is not ok. ${response.status}</p>`;
        }
        
        if (data.message === "Successful") {
            resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅"Access Token Stored, token: ${data.access_token}"</p>`
            console.log("Access Token Stored, token: " + data.access_token)
            document.cookie = "access_token=" + data.access_token               
        } else {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">Operation failed. Try again.</p>`
            console.log("Unsuccessful.")
        }
    }

    catch(error) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌Error storing token.</p>`
        console.log("Error catched: " + error.message)
    }
}

async function send_token() {
    // const accessToken = getCookie(access_token)
    const resultDiv = document.getElementById("result")

    try {
        let apiURL = "http://localhost:3000/addToken"
        const response = await fetch (apiURL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                value: "salam"
            })
        })
        console.log("Request for updating token was sent successfully.")

        const data = await response.text();
        console.log(data)
        resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">${data}</p>`

    } catch (error) {
        let resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error in sending the token to DB: ${error.message}</p>`
        console.log("Catched error: " + error.message)
    }    
}