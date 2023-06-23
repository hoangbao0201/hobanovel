import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../library/connectMySQL";

import { ChapterType, ChapterViewersType } from "../types";

export const getDataChapterByUrlMTCHandle = async ({ novelSlug, chapterNumber } : ChapterType) => {
    try {
        // Get Data Chapter
        let urlChapter = `https://metruyencv.com/truyen/${novelSlug}/chuong-${chapterNumber}`
 
        const response = await axios.get(urlChapter);
        const $1 = cheerio.load(response.data);

        const checkChapter : string = $1('.unlock-chapter__title').text()
        if(checkChapter === "— Chương Bị Khoá —") {
            throw new Error('Chapter is locked')
        }

        const title = $1('div.nh-read__title').text()
        const titleIndex = title.indexOf(":")
        const convertTitle = title.slice(titleIndex+1).trim();

        const dataChapter = {
            title: convertTitle,
            content: $1('div#article').html(),
            chapterNumber: Number(chapterNumber),
        }

        return {
            success: true,
            data: dataChapter
        }

    } catch (error) {
        return {
            success: false,
            error: error?.message
        }
    }
}

export const createChapterByDataHandle = async (data : ChapterType) => {
    try {
        const connection = await pool.getConnection();

        const {
            userId, novelSlug, novelName, novelId, title, content, chapterNumber
        } = data
        
        const qCreateChapter = `
            INSERT INTO chapters(userId, novelSlug, novelName, novelId, title, content, chapterNumber )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [ userId, novelSlug, novelName, novelId, title, content, chapterNumber ]

        const [rows] = await connection.query(qCreateChapter, values);

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
};

export const getChapterDetailHandle = async ({ userId, novelSlug, chapterNumber } : ChapterType) => {
    try {
        const connection = await pool.getConnection();

        const qCreateChapter = `
            SELECT chapters.chapterId, chapters.novelName, chapters.novelSlug, chapters.title, users.name AS creator, users.userId AS creatorId,
                chapters.content, chapters.chapterNumber, chapters.updatedAt, chapters.novelId, chapters.views,
                novels.chapterCount
            FROM chapters
                LEFT JOIN users ON users.userId = chapters.userId
                LEFT JOIN novels ON novels.novelId = chapters.novelId
                
            WHERE chapters.novelSlug = ? AND chapters.chapterNumber = ?;
        `;
        // LEFT JOIN novel_followers ON novel_followers.novelId = chapters.novelId ${userId ? 'AND novel_followers.userId = ?' : ''}
                
        let params = [novelSlug, chapterNumber]
        if(userId) {
            params.push(userId)
        }
        const [rows] = await connection.query(qCreateChapter, params);

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
};

export const getChapterBasicHandle = async ({ novelSlug, chapterNumber } : ChapterType) => {
    try {
        const connection = await pool.getConnection();

        const qCreateChapter = `
            SELECT chapterId, novelName, novelSlug, title, chapterNumber, chapters.views, updatedAt, novelId FROM chapters
            WHERE novelSlug = ? AND chapterNumber = ?
        `;

        const [rows] = await connection.query(qCreateChapter, [novelSlug, chapterNumber]);

        connection.release();

        return rows
    } catch (error) {
        return error
    }
};

export const increaseViewChapterHandle = async ({ userId, chapterId } : ChapterViewersType) => {
    try {
        const connection = await pool.getConnection();

        const conditionsInc = `userId ${userId ? '= ?' : 'IS NULL'} AND chapterId = ? `
        let paramsInc = [chapterId]
        if(userId) {
            paramsInc.unshift(userId)
        }

        const qIncreaseViewChapter = `
            UPDATE chapter_viewers
            SET chapter_viewers.views = chapter_viewers.views + 1
            WHERE ${conditionsInc}
        `
        const [rowsInc] : any = await connection.query(qIncreaseViewChapter, paramsInc);

        if(rowsInc.affectedRows === 0) {
            const qCreateChapter = `
                INSERT INTO chapter_viewers(userId, chapterId)
                VALUES (?,?)
            `;

            await connection.query(qCreateChapter, [userId || null, chapterId]);
        }

        connection.release();

        return {
            success: true,
            data: rowsInc
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};



