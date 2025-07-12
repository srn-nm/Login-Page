import fs from "fs"
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
app.use(express.json())
app.use(cors())


app.post("/challenge", async (req, res) => {
    try {
        const dataSending = {
            username: req.body.username,
            password: req.body.password,
            type: req.body.type,  
            authType: req.body.authType  
        }

        const apiURL = "http://172.16.20.173/api/v1/authentication/login/challenge"
        
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataSending)
        })

        if (!response.ok) {
            console.log("response is not ok")
            
            let responseBody = await response.text()
            console.log("Response body:", responseBody);
            res.status(response.status).send(responseBody)

            // const responseData = await response.json();
            // console.log(responseData.errors[0].msg);
            // res.status(response.status).send(responseData.errors[0].msg)

            // responseBody = {"errors":[{"msg":"Invalid credentials","code":1}]}
            return;
        } else {
            console.log("response is ok")
            const data = await response.json();
           
            console.log("Challenge Successful.");
            res.status(200).send(data.id)
        }
    } catch (error) {
        console.error("Error catched: " + error);
        res.status(response.status).send("Error catched: " + error)
        return;
    }
})

app.post("/handle_QR_authentication", async (req, res) => {
    try {
        const challengeID = req.body.challengeID
        const authenticationCode = req.body.authenticationCode
        // let rawChallengeID = req.body.challengeID 
        // let challengeID = rawChallengeID.replace(/^"|"$/g, '');
        
        const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeID}/totp/verify`;
        // console.log(apiURL)

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: authenticationCode
            })
        })

        if (!response.ok) {
            console.log("Handle QR authentication's response is not ok.")

            let responseBody = await response.text()
            console.log("Response body:", responseBody);

            res.status(response.status).send(responseBody)

            // {"errors":[{"msg":"Invalid credentials","code":1}]}
            // const errorMessage = responseBody.errors[0].msg
            // console.log(errorMessage)
            //////////////inja bauad dorost she beporsam
            return;

        } else {
            console.log("response is ok.")
            const data = await response.json();
            console.log("Successful: " + JSON.stringify(data));
            res.status(200).send("Successful")
        }
    } catch(error) {
        console.log("Handle QR Authentication: Error catched: " + error.message)
        res.status(500).send("Handle QR Authentication: Error catched. " + error)
        return
    }
})

app.post("/send_sms_to_mobile", async (req, res) => {
        let challengeID = req.body.challengeID 
    try {
        const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeID}/mobile`;

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: challengeID
            })
        })

        console.log(apiURL)

        if (!response.ok) {
            let responseBody = await response.text()
            console.log("Sending sms to mobile's Response is not OK. Response body:" + responseBody)
            res.status(response.status).send(responseBody)

        } else {
            console.log("Sending SMS to mobile was successful!")
            res.status(200).send("Sending SMS to mobile was successful!")
        }
    } catch(error) {
        console.log("Sending SMS to mobile: Error catched. " + error)
        res.status(500).send("Sending SMS to mobile: Error catched. " + error)
    }
})

app.post("/handle_SMS_verification", async (req, res) => {
    const challengeID = req.body.challengeID 
    const verificationCode = req.body.verificationCode
    
    if (!challengeID) {
        console.error("No challenge ID found!");
        return;
    }
    try {
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
            let responseBody = await response.text()
            console.log(responseBody);  //
            // const errorMessage = responseBody.errors[0].msg
            // console.log(errorMessage)
             
            //////////////inja bauad dorost she 
            res.status(response.status).send(responseBody)

        } else {
            const data = await response.json();
            res.status(200).send("Successful")
        }
    } catch(error) {
        console.log("Catched error in SMS verification: " + error.message)
        res.status(500).send("Error in SMS Verification: Error catched. " + error)
    }
})

app.post("/get_access_token", async (req, res) => {
    try {
        const apiURL = `http://172.16.20.173/api/v1/authentication/login/access-token`;

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Credentials": "include"
            },
            body: JSON.stringify({})
        })

        if (!response.ok) {
            console.log("Response failed in getting access token."); 
            let responseBody = await response.text()
            console.log(responseBody);
            res.status(response.status).send(responseBody)
            return;
        } else {   
            const data = await response.json();
            if (!data.access_token) {
                console.log("Access token doesnt exist.")
                res.status(response.status).send("Access token doesnt exist.")
                return;
            }

            if (data.message === "Successful") {
                console.log("Access Token Stored, token: " + data.access_token)
                res.status(200).send(data.access_token)             
            } else {
                console.log("Unsuccessful.")
                res.status(response.status).send("Unsuccessful.")
                return;
            }            
        }
    } catch(error) {
        console.log("Error catched in getting access token: " + error.message)
        res.status(500).send(error)
    }
})

app.post("/addTokenToDB", async (req, res) => {
    const newAccessToken = req.body.newAccessToken

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const csvPath = path.join(__dirname, "data.csv");

    const newValue = newAccessToken;
    fs.writeFileSync(csvPath, newValue, "utf-8");

    res.status(200).send("Successfull.")
})

const port = 4000
app.listen(port , () => {
    console.log("Server running on port " + port + ".")
})
