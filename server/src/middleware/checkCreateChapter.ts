import { Request, Response, NextFunction } from "express";
import pool from "../library/connectMySQL";

export const checkCreateChapter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let connection;
    try {
        const { slug, chapterNumber } = req.params;
        if(!slug || !chapterNumber) {
            res.status(400).json({
                success: false,
                message: "Data not found"
            })
            return;
        }
        
        connection = await pool.getConnection();

        const qCheckCreateChapter = `
            SELECT novelId, title FROM novels
            WHERE slug = ? AND userId = ?
        `
        const [rows] : any = await connection.query(qCheckCreateChapter, [slug, res.locals.user.userId]);
        if(!rows?.length) {
            res.status(400).json({
                success: false,
                message: "This series has been posted by another user",
            })
            return;
        }

        res.locals.novel = rows[0]
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
