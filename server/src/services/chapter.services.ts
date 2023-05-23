import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../library/connectMySQL";

import { ChapterType } from "../types";

export const getDataChapterByUrlMTCHandle = async ({ novelSlug, chapterNumber } : ChapterType) => {
    try {
        // Get Data Chapter
        let urlChapter = `https://metruyencv.com/truyen/${novelSlug}/chuong-${chapterNumber}`
 
        const response = await axios.get(urlChapter);
        const $1 = cheerio.load(response.data);

        const checkChapter : string = $1('.unlock-chapter__title').text()
        if(checkChapter === "— Chương Bị Khoá —") {
            return {
                success: false,
                error: "Chapter bị khóa"
            }
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
            error: error
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
            VALUES (?)
        `;

        const values = [ userId, novelSlug, novelName, novelId, title, content, chapterNumber ]

        const [rows] = await connection.query(qCreateChapter, [values]);

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

export const getChapterDetailHandle = async ({ novelSlug, chapterNumber } : ChapterType) => {
    try {
        const connection = await pool.getConnection();

        const qCreateChapter = `
            SELECT chapters.chapterId, chapters.novelName, chapters.novelSlug, chapters.title, users.name AS creator, users.userId AS creatorId,
                chapters.content, chapters.chapterNumber, chapters.updatedAt, chapters.novelId, chapters.views
            FROM chapters
                LEFT JOIN users ON users.userId = chapters.userId

            WHERE chapters.novelSlug = ? AND chapters.chapterNumber = ?;
        `;

        const [rows] = await connection.query(qCreateChapter, [novelSlug, chapterNumber]);

        connection.release();

        return rows
    } catch (error) {
        return error
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

export const increaseViewChapterHandle = async ({ chapterId } : ChapterType) => {
    try {
        const connection = await pool.getConnection();

        const qCreateChapter = `
            UPDATE chapters
            SET views = views + 1
            WHERE chapterId = ?
        `;

        const [rows] = await connection.query(qCreateChapter, chapterId);

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



