import pool from "../library/connectMySQL";
import { NovelFollowerType } from "../types";


export const checkFollowNovelHanle = async ({ novelId, userId } : NovelFollowerType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetFollow = `
            SELECT 1 FROM novel_followers
            WHERE novelId = ? AND userId = ?
        `;
        const [rows] = await connection.query(qGetFollow, [novelId, userId]);

        return {
            success: true,
            data: rows as NovelFollowerType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
};