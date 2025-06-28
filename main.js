function clickLoginButton() {
    document.getElementById("result").innerHTML = "...درحال تست"
    challenge();
}

async function challenge() {
    const resultDiv = document.getElementById("result");
    if (resultDiv){
        resultDiv.innerHTML = "...درحال بررسی"
    }
    
    currentUsername = document.getElementById("username").value;
    currentPassword = document.getElementById("password").value;
    currentAuthType = document.getElementById("authTypeDropDown").value;
    currentType = document.getElementById("typeDropDown").value;

    const dataSending = {
        authType: currentAuthType,  //"MOBILE",
        password: currentPassword,
        type: currentType,  //"USERPASS", LDAP
        username: currentUsername
    };

    if (currentType == "LDAP" && currentAuthType == "QR") {
        QR_verification_page();
    } else if (currentType == "USERPASS" && currentAuthType == "MOBILE") {
        SMS_verification_page();
    } else {
        // what to do maybe error?
    }

    // try {
    //     const apiURL = "http://172.16.20.173/api/v1/authentication/login/challenge"
        
    //     const response = await fetch(apiURL, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(dataSending)
    //     })

    //     // if (!response.ok) {
    //     //     resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌Response is not ok. ${response.status}</p>`;
    //     // }  

    //     const data = await response.json();
        
    //     if (JSON.stringify(data.id)) {
    //         resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Successful!! ${JSON.stringify(data)}}</p>`;
    //         document.cookie = "challenge_id=" + JSON.stringify(data.id);
    //         SMS_verification_page(); 
            
    //     } else if (JSON.stringify(data.errors)) {
    //         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error!! ${JSON.stringify(data.errors[0].msg)}</p>`;
    //     } 

    //     // this is a help:
    //     ///////////////////////
    //     // const data = [{"msg":"String should have at least 6 characters","code":0,"loc":["body","username"]}];
    //     // const message = data[0].msg;  // Extracts the message from the first object
    //     // console.log(message);  // Output: String should have at least 6 characters
    
    // } catch (error) {
    //     resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Network or JavaScript Error: ${error.message}</p>`;
    // }
}

function QR_verification_page() {
    const resultDiv = document.getElementById("result");
    if (resultDiv){
        resultDiv.innerHTML = "...درحال بررسی"
    }

    // checking if the user has already scanned the qr code and has access to authenticator
    // if they have previously scanned the qr code this function will be called:
    // add_QR_code();
    // and if they have previously scanned the qr or have just done it now, this function will be called:
    QR_authentication();
}

function add_QR_code() {
    window.location.assign("addingQRCode.html");
    
    // todo
}

async function QR_authentication() {
    window.location.assign("QRAuthenticationPage.html");
    //in code paiin tu in function bayad karkardesh check she
    try {
        const authenticationCode = document.getElementById("verificationCode");

        const apiURL = ``; //todo

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: verificationCode
            })
        })

        const data = await response.json();

        if (!response.ok) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;"> response is not ok. ${response}</p>`;
        }

        resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Successful! ${JSON.stringify(data)}}</p>`;

        if (data.message === "Successful") {
            resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Verification successful!</p>`
            this.successful_login_page();
            
        } else {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Verification failed. Try again.</p>`
        }
    }

    catch(error) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error verifying code.</p>`
    }
}

function SMS_verification_page() {
    const resultDiv = document.getElementById("result");
    if (resultDiv){
        resultDiv.innerHTML = "...درحال بررسی"
    }

    send_sms_to_mobile();

    window.location.assign("SMSVerificationPage.html")

    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : undefined;
    };

    const resultDiv2 = document.getElementById("result2");
    if (resultDiv2){
        resultDiv2.innerHTML = getCookie("mobile"); //namayeshe mobile un zir
    }
}

async function send_sms_to_mobile() {
    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : undefined;
    };
    
    const challengeId = getCookie("challenge_id");
    
    if (!challengeId) {
        console.error("No challenge ID found!");
        return;
    }
    
    const resultDiv = document.getElementById("result");

    // try {
    //     const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeID}/mobile`;

    //     const response = await fetch(apiURL, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             "id": challengeId
    //         })
    //     })

    //     const data = await response.json();

    //     if (!response.ok) {
    //         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;"> response is not ok. ${response}</p>`;
    //     }

    //     resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Successful! ${JSON.stringify(data)}}</p>`;
    //     document.cookie = "mobile=" + data.mobile;
    //     document.cookie = "expires_in=" + data.expires_in;
    // }

    // catch(error) {
    //     resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Unsuccessful. Reason: (${(error)})</p>`;
    // }
}

async function handle_SMS_verification() { 
    const verificationCode = document.getElementById("verificationCode").value;

    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : undefined;
    };
    
    const challengeId = getCookie("challenge_id");
    
    // if (!challengeId) {
    //     console.error("No challenge ID found!");
    //     return;
    // }

    // try {
    //     const resultDiv = document.getElementById("result");
    //     const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeId}/mobile/verify`;

    //     const response = await fetch(apiURL, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             code: verificationCode
    //         })
    //     })

    //     const data = await response.json();

    //     if (!response.ok) {
    //         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;"> response is not ok. ${response}</p>`;
    //     }

    //     resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Successful! ${JSON.stringify(data)}}</p>`;

    //     if (resultDiv) {
    //         if (data.message === "Successful") {
    //             resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Verification successful!</p>`
    //             this.successful_login_page();
                
    //         } else {
    //             resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Verification failed. Try again.</p>`
    //         }
    //     } else {
    //         console.error("Error: 'result' div not found!");
    //     }
    // }

    // catch(error) {
    //     const resultDiv = document.getElementById("result");
    //     resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error verifying code.</p>`
    // }
    
    const resultDiv = document.getElementById("result");  ///////////////testing
    resultDiv.innerHTML = `<p style="color: blue; font-size: 18px;">Your verification code: ${verificationCode}</p>`
    this.successful_login_page();
}

function successful_login_page() {
    this.get_access_token();

    window.location.assign("successfulLoginPage.html");

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<p style="color: blue; font-size: 18px;">...در حال بررسی دسترسی</p>`
}

async function get_access_token() {
    try {
        const resultDiv = document.getElementById("result");
        const apiURL = `http://172.16.20.173/api/v1/authentication/login/access-token`;

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                
            })
        })

        const data = await response.json();

        if (!response.ok) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;"> response is not ok. ${response}</p>`;
        }

        if (resultDiv) {
            if (data.message === "Successful") {
                resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅"Access Token Stored, token: ${data.access_token}"</p>`
                // what to do next?               
            } else {
                resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">Operation failed. Try again.</p>`
            }
        } else {
            console.error("Error: 'result' div not found!");
        }
    }

    catch(error) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌Error storing token.</p>`
    }
}

function giveAccessToData() {
    // now the user has access to the data
}