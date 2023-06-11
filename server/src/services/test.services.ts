import pool from "../library/connectMySQL";

export const testDemoHandle = async () => {
    try {

        const connection = await pool.getConnection();

        const q1 = `
            SELECT * FROM users;
        `

        // connection.query(q1, (error : any, result : any) => {
        //     if(error) {
        //         return {
        //             success: false,
        //             error: error
        //         }
        //     }
        //     return {
        //         success: true,
        //         data: result
        //     }
        // });


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
