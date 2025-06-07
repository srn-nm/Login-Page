function clickLoginButton() {
    document.getElementById("result").innerHTML = "...درحال تست"
    Challenge();
}

async function Challenge() {
    const resultDiv = document.getElementById("result");
    if (resultDiv){
        resultDiv.innerHTML = "...درحال بررسی"
    }
    
    currentUsername = document.getElementById("username").value;
    currentPassword = document.getElementById("password").value;
    currentAuthType = document.getElementById("authTypeDropDown").value;
    currentType = document.getElementById("typeDropDown").value;

    const requestData = {
        authType: currentAuthType,  //"MOBILE",
        password: currentPassword,
        type: currentType,  //"USERPASS",
        username: currentUsername
    };
    
    try {
        const apiURL = "http://172.16.20.173/api/v1/authentication/login/challenge"
        
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        })

        const data = await response.json();

        if (!response.ok) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">Response is not ok. ${response}</p>`;
        } else if (response.error) {
            resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">An Error occurred.${response.error}</p>`;
        }

        resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Successful! ${JSON.stringify(data)}}</p>`;
        //show_verification_page();
    }
    
    catch(error) {
        resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Unsuccessful. (${(error)})</p>`;
    }    
}


// function show_verification_page() {

//     const resultDiv = document.getElementById("result");
//     if (resultDiv){
//         resultDiv.innerHTML = "...درحال بررسی"
//     }

//     this.send_sms_to_mobile();

//     this.target.innerHTML = `
//         <style>
//             body {
//                 font-family: "Arial", sans-serif;
//                 background-color: #f4f4f4;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 height: 500px;
//                 width: 400px;
//                 margin: 0;
//                 flex-shrink: 0;
//             }

//             .verification-form {
//                 background-color: white;
//                 padding: 40px;
//                 border-radius: 8px;
//                 box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
//                 width: 400px;
//                 text-align: center;
//                 flex-shrink: 0;
//             }

//             .verification-form h2 {
//                 font-size: 24px;
//                 margin-bottom: 20px;
//                 color: #333;
//             }

//             .verification-form button,
//             .verification-form input {
//                 width: 100%;
//                 padding: 12px;
//                 margin: 10px 0;
//                 font-size: 16px;
//                 border: 1px solid #ccc;
//                 border-radius: 6px;
//                 display: block;
//                 text-align: center;

//             }

//             .verification-form button {
//                 background-color: #007bff;
//                 color: white;
//                 font-size: 18px;
//                 cursor: pointer;
//                 border: none;
//                 transition: 0.3s ease;
//             }

//             .verification-form button:hover {
//                 background-color: #0056b3;
//             }

//             #result {
//                 font-size: 18px;
//                 color:  #0056b3;
//                 margin-top: 20px;
//             }

//             #result2 {
//                 font-size: 18px;
//                 color:  #0056b3;
//                 margin-top: 20px;
//             }
//         </style>

//         <div class="verification-form">
//             <h2>کد ارسال شده به تلفن همراه را وارد کنید</h2>

//             <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;" >
//                 <input type="text" id="verificationCode" maxlength="4" placeholder="_ _ _ _‍" />
//                 <button id="verifyButton">بررسی</button>
//             </div>
            
//             <div id="result"></div>
//             <div id="result2"></div>
            
//         </div>
//     `;

//     const getCookie = (name: string): string | undefined => {
//         const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//         return match ? match[2] : undefined;
//     };
//     // yek rah baraye gereftane cookie va hefzesh bayad peyda konam

//     if (resultDiv){
//         const resultDiv2 = document.getElementById("result2");\z
//         resultDiv2.innerHTML = getCookie("mobile"); //namayeshe mobile un zir
//     }

//     const verifyButton = this.target.querySelector("#verifyButton") as HTMLButtonElement;
//     verifyButton.addEventListener("click", () => {

//         this.handle_SMS_verification();
//         // this.currentVerificationCode = (document.getElementById("password") as HTMLInputElement).value;
//     }); 
// }

// function send_sms_to_mobile() {
//     const getCookie = (name: string): string | undefined => {
//         const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//         return match ? match[2] : undefined;
//     };
    
//     const challengeId = getCookie("Challenge_id");
    
//     if (!challengeId) {
//         console.error("No challenge ID found!");
//         return;
//     }
    
//     const resultDiv = document.getElementById("result");

//     try {
//         const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeId}/mobile`;

//         const response = await fetch(apiURL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 id: challengeId
//             })
//         })


//         const data = await response.json();

//         if (!response.ok) {
//             resultDiv.innerHTML = `<p style="color: red; font-size: 18px;"> response is not ok. ${response}</p>`;
//         }

//         resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Successful! ${JSON.stringify(data)}}</p>`;
//         document.cookie = "mobile=" + data.mobile;
//         document.cookie = "expires_in=" + data.expires_in;

//         this.show_verification_page();
//     }

    
//     catch(error) {
//         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌ Unsuccessful. (${(error)})</p>`;
//     }

// }

// function handle_SMS_verification() { 
//     const verificationCode = (document.getElementById("verificationCode") as HTMLInputElement)?.value;

//     const getCookie = (name: string): string | undefined => {
//         const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//         return match ? match[2] : undefined;
//     };
    
//     const challengeId = getCookie("Challenge_id");
    

//     if (!challengeId) {
//         console.error("No challenge ID found!");
//         return;
//     }

//     try {
//         const resultDiv = document.getElementById("result");
//         const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeId}/mobile/verify`;

//         const response = await fetch(apiURL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 code: verificationCode
//             })
//         })


//         const data = await response.json();

//         if (!response.ok) {
//             resultDiv.innerHTML = `<p style="color: red; font-size: 18px;"> response is not ok. ${response}</p>`;
//         }

//         resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅ Successful! ${JSON.stringify(data)}}</p>`;

//         if (resultDiv) {
//             if (data.message === "Successful") {
//                 resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅Verification successful!</p>`
//                 // lets go to the next page
//                 this.successful_login_page()
                
//             } else {
//                 resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌Verification failed. Try again.</p>`
//             }
//         } else {
//             console.error("Error: 'result' div not found!");
//         }
//     }

    
//     catch(error) {
//         const resultDiv = document.getElementById("result");
//         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌Error verifying code.</p>`
//     }
    
//     const resultDiv = document.getElementById("result");  ///////////////testing
//     resultDiv.innerHTML = `<p style="color: blue; font-size: 18px;">Your verification code: ${verificationCode}</p>`
//     this.successful_login_page();
//     this.get_access_token();

// }

// function successful_login_page() {
//     this.get_access_token();

//     this.target.innerHTML = `
//         <style>
//             body {
//                 font-family: "Arial", sans-serif;
//                 background-color: #f4f4f4;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 height: 500px;
//                 width: 400px;
//                 margin: 0;
//                 flex-shrink: 0
//             }

//             .loginsuccessful-page {
//                 background-color: white;
//                 padding: 40px;
//                 border-radius: 8px;
//                 box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
//                 width: 400px;
//                 text-align: center;
//                 flex-shrink: 0
//             }

//             .loginsuccessful-page h2 {
//                 font-size: 28px;
//                 margin-bottom: 20px;
//                 color: #333;
//             }


//             #result {
//                 font-size: 18px;
//                 color:  #0056b3;
//                 margin-top: 20px;
//             }

            
//         </style>

        
//         <div class="loginsuccessful-page">

//             <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;" >
//                 <h2>ورود موفقیت آمیز</h2>
//                 <div id="result"></div>
//             </div>

//         </div>
//     `;

//     const resultDiv = document.getElementById("result");
//     resultDiv.innerHTML = `<p style="color: blue; font-size: 18px;">...در حال بررسی دسترسی</p>`
    
// }

// function get_access_token() {

//     try {
//         const resultDiv = document.getElementById("result");
//         const apiURL = `http://172.16.20.173/api/v1/authentication/login/access-token`;

//         const response = await fetch(apiURL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
                
//             })
//         })

//         const data = await response.json();

//         if (!response.ok) {
//             resultDiv.innerHTML = `<p style="color: red; font-size: 18px;"> response is not ok. ${response}</p>`;
//         }

//         if (resultDiv) {
//             if (data.message === "Successful") {
//                 resultDiv.innerHTML = `<p style="color: green; font-size: 18px;">✅"Access Token Stored, token: ${data.access_token}"</p>`
//                 // what to do next?
                
//             } else {
//                 resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">Operation failed. Try again.</p>`
//             }
//         } else {
//             console.error("Error: 'result' div not found!");
//         }
//     }

//     catch(error) {
//         const resultDiv = document.getElementById("result");
//         resultDiv.innerHTML = `<p style="color: red; font-size: 18px;">❌Error storing token.</p>`
//     }
// }
