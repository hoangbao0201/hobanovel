import pool from "../library/connectMySQL";

export const testDemoHandle = async () => {
    try {

        const connection = await pool.getConnection();

        const q1 = `
            UPDATE FROM novels
            SET category = 5
            WHERE novels.category = 'Đô Thị'
        `
        const [rows] : any = await connection.query(q1);

        connection.release();

        return {
            success: true,
            data: rows
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
}
