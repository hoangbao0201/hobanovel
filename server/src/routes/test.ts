import express from "express"
const router = express.Router()

import { testDemo } from "../controllers/TestController";
import pool from "../library/connectMySQL";



router.get("/demo", async (req, res) => {
    try {
        const connection = await pool.getConnection();
    
        const [rows] = await connection.query('SELECT * FROM users');
    
        connection.release();

        return res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({
            success: false,
            error: "Error executing query: " + error.message
        });
    }
});




export default router;