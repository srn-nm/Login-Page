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

app.post("/addToken", async (req, res) => {
    try {
        const pool = await mssql.connect(sqlServerConfiguration)
        await pool.request()
            .input("value", mssql.VarChar, req.body.value)
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