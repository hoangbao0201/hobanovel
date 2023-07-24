import pool from "../library/connectMySQL";

export const testDemoHandle = async () => {
    let connection;
    try {
        connection = await pool.getConnection();

        const q1 = `
            SELECT * FROM users;
        `

        const [rows] : any = await connection.query(q1);

        return {
            success: true,
            data: rows
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
}
