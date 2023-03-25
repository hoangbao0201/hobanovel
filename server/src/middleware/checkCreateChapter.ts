import { Request, Response, NextFunction } from "express";
import pool from "../library/connectMySQL";

export const checkCreateChapter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { slug, chapterNumber } = req.params;
        if(!slug || !chapterNumber) {
            res.status(400).json({
                success: false,
                message: "Data not found"
            })
            return;
        }
        
        const connection = await pool.getConnection();

        const qCheckCreateChapter = `
            SELECT novelId, title FROM novels
            WHERE slug = ? AND userId = ?
        `
        const [rows] : any = await connection.query(qCheckCreateChapter, [slug, res.locals.user.userId]);
        if(!rows?.length) {
            res.status(400).json({
                success: false,
                message: "Value invalid"
            })
            return;
        }

        connection.release()

        res.locals.novel = rows[0]
        next();
    } catch (error) {
        next(error);
    }
};
