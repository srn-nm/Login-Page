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
        return;
    } else if (currentPassword.length < 8) {
        passwordErrorDiv.innerHTML = `<p style="color: red; font-size: 14px;">!گذرواژه حداقل 8 کاراکتر مجاز دارد</p>`
        return;
    } else {
        passwordErrorDiv.innerHTML = ''
    }

    const dataSending = {
        authType: currentAuthType,  //"MOBILE", QR
        password: currentPassword,
        type: currentType,  //"USERPASS", LDAP
        username: currentUsername
    };

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
    //     //     return;
    //     // }  

    //     const data = await response.json();
        
    //     if (JSON.stringify(data.id)) {
    //         resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Successful!! ${JSON.stringify(data)}}</p>`;
    //         console.log("Successful!!");
    //         document.cookie = "challenge_id=" + JSON.stringify(data.id);

    //         if (currentType == "LDAP" && currentAuthType == "QR") {
    //             QR_verification_page();
    //         } else if (currentType == "USERPASS" && currentAuthType == "MOBILE") {
    //             SMS_verification_page();
    //         } else {
    //             // what to do maybe error?
    //         } 
            
    //     } else if (JSON.stringify(data.errors)) {
    //         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Error!! ${JSON.stringify(data.errors[0].msg)}</p>`;
    //         console.error("Error!!");
    //         return;
    //     }

    // } catch (error) {
    //     resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Network or JavaScript Error! : ${error.message}</p>`;
    //     console.error("Network or JavaScript Error.");
    //     return;
    // }

    SMS_verification_page(); ///////testing (should be removed)
}

function QR_verification_page() {
    const resultDiv = document.getElementById("result");
    if (resultDiv){
        resultDiv.innerHTML = "...درحال بررسی"
    }

    // checking if the user has already scanned the qr code and has access to authenticator
    // if they had previously scanned the qr code, then this function would be called:
    // add_QR_code();
    // and if they had previously scanned the qr or had done it just now, this function would be called:
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

        if (authenticationCode.length == 0) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">!وارد کردن کد اجباری است</p>`;
            return;
        } else if (authenticationCode.length < 6) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">!کد باید 4 رقمی باشد</p>`;
            return;
        }

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
        resultDiv2.innerHTML = getCookie("mobile"); 
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

    if (verificationCode.length == 0 ) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">!وارد کردن کد اجباری است</p>`;
        return;
    } else if (verificationCode.length < 4) {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">!کد باید 4 رقمی باشد</p>`;
        return;
    }

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

function give_access_to_data() {
    // now the user has access to the data
}