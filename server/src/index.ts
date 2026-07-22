import express = require("express")
import mysql = require("mysql2/promise")
import dotenv = require("dotenv")

dotenv.config()

const app = express()
const port = 3001

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
} = process.env

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error("Missing required database settings in server/.env")
}

const pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT ?? "3306"),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
})

app.get("/api/test", (_request, response) => {
    response.json({
        message: "The backend server is working",
    })
})

app.get("/api/db-test", async (_request, response) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS connected")

        response.json({
            message: "The database connection is working",
            result: rows,
        })
    } catch (error) {
        console.error(error)

        response.status(500).json({
            message: "The database connection failed",
        })
    }
})

app.get("/api/photos", async (_request, response) => {
    try {
        const [rows] = await pool.query(`
      SELECT
        id,
        title,
        image_path AS imagePath,
        category,
        album_slug AS albumSlug,
        keywords,
        created_at AS createdAt
      FROM photos
      ORDER BY id
    `)

        response.json(rows)
    } catch (error) {
        console.error(error)

        response.status(500).json({
            message: "Unable to retrieve photos",
        })
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})