// INSERT INTO tokenTable VALUES (@value)
// UPDATE tokenTable SET token = @Value


import express from "express"
import mssql from "mssql/msnodesqlv8.js"
import cors from "cors"


const app = express()
app.use(express.json())
app.use(cors())


// const sqlServerConfiguration = {
//     // user: "DESKTOP-GBBCHEM/sarina",
//     // password: "",
//     server: "DESKTOP-GBBCHEM/sarina",
//     database: "tokenDB",
//     driver: 'msnodesqlv8',
//     options: {
//         trustedConnection: true
//     }
// }

const sqlServerConfiguration = {
    connectionString: "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-GBBCHEM;Database=tokenDB;Trusted_Connection=Yes;"
}

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
            
            res.status(500).send("Response not ok: " + responseBody)

            // const errorMessage = responseBody.errors[0].msg
            // console.log(errorMessage)
            //////////////inja bauad dorost she beporsam
            return;

        } else {
            console.log("response is ok")
            const data = await response.json();
           
            console.log("Challenge Successful!!");

            res.status(200).send(data.id)
        }

    } catch (error) {
        console.error("Error catched: " + error);
        res.status(500).send("Error catched: " + error)
        return;
    }
})

app.post("/handle_QR_authentication", async (req, res) => {
    try {
        const authenticationCode = req.body.authenticationCode
        // let rawChallengeID = req.body.challengeID 
        // let challengeID = rawChallengeID.replace(/^"|"$/g, '');
        
        const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeID}/totp/verify`;

        console.log(apiURL)
        console.log(req.body.challengeID)
        console.log(authenticationCode)

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

            res.status(response.status).send("ResponseBody: " + responseBody)

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
        console.log("Error catched: " + error.message)
        return
    }
})

app.post("/send_sms_to_mobile", async (req, res) => {
        let challengeID = req.body.challengeID //.replace(/^"|"$/g, '');
    try {
        const apiURL = `http://172.16.20.173/api/v1/authentication/login/challenge/${challengeID}/mobile`;

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": challengeID
            })
        })

        if (!response.ok) {
            console.log("Sending sms to mobile's Response is not OK.")
            let responseBody = await response.text()
            res.status(500).send("Response not ok: " + responseBody)

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
    const challengeID = req.body.challengeID //.replace(/^"|"$/g, '');
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
            console.log("Response body:", responseBody);  //
            // const errorMessage = responseBody.errors[0].msg
            // console.log(errorMessage)
             
            //////////////inja bauad dorost she 
            res.status(500).send(responseBody)

        } else {
            const data = await response.json();
            res.status(200).send("Successful")
        }
    } catch(error) {
        console.log("Catched error in sms verification: " + error.message)
        res.status(500).send("Error in SMS Verification: Error catched. " + error)
    }
})

app.post("/get_access_token", async (req, res) => {
    try {
        const apiURL = `http://172.16.20.173/api/v1/authentication/login/access-token`;

        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        })

        if (!response.ok) {
            console.log("Response failed in get access token"); 
            let responseBody = await response.text()
            console.log("Response body:", responseBody);
            res.status(500).send(responseBody)
            return;
        } else {   
            const data = await response.json();
            if (!data.access_token) {
                console.log("access token doesnt exist.")
                res.status(500).send("access token doesnt exist.")
                return;
            }

            if (data.message === "Successful") {
                console.log("Access Token Stored, token: " + data.access_token)
                res.status(200).send(data.access_token)             
            } else {
                console.log("Unsuccessful.")
                res.status(500).send("Unsuccessful.")
                return;
            }            
        }
    } catch(error) {
        console.log("Error catched in getting access token: " + error.message)
        res.status(500).send(error)
    }
})

app.post("/addToken", async (req, res) => {
    const accessToken = req.body.accessToken
    
    try {
        const pool = await mssql.connect(sqlServerConfiguration)
        await pool.request()
            .input("value", mssql.VarChar, accessToken)
            .query("UPDATE tokenTable SET token = @Value")

        const now = new Date()
        console.log("Token updated successfully at: " + now.toLocaleString())
        res.status(200).send("Token updated successfully at: " + now.toLocaleString())

    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

const port = 3000
app.listen(port , () => {
    console.log("Server running on port " + port + ".")
})