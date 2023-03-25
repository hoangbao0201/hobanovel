import pool from "../library/connectMySQL";

export const testDemoHandle = async () => {
    try {

        const connection = await pool.getConnection();

        const q = `
            INSERT INTO USERS(name, username, email, password)
            VALUES (?)
        `
        const values = ["1", "username", "email", "password"]
        const [rows] : any = await connection.query(q, [values]);

        connection.release();

        return rows
    } catch (error) {
        return null
    }
}
