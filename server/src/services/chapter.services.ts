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
            novelSlug, novelName, novelId, title, content, chapterNumber
        } = data
        
        const qCreateChapter = `
            INSERT INTO chapters(novelSlug, novelName, novelId, title, content, chapterNumber )
            VALUES (?)
        `;

        const values = [ novelSlug, novelName, novelId, title, content, chapterNumber ]

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
            SELECT chapters.chapterId, chapters.novelName, chapters.novelSlug, chapters.title, chapters.content, chapters.chapterNumber, chapters.updatedAt, chapters.novelId, chapterdetail.views, chapterdetail.love, chapterdetail.like, chapterdetail.fun, chapterdetail.sad, chapterdetail.angry, chapterdetail.attack
                FROM chapters
                LEFT JOIN chapterdetail ON chapterdetail.chapterId = chapters.chapterId
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
            SELECT chapterId, novelName, novelSlug, title, chapterNumber, updatedAt, novelId FROM chapters
            WHERE novelSlug = ? AND chapterNumber = ?
        `;

        const [rows] = await connection.query(qCreateChapter, [novelSlug, chapterNumber]);

        connection.release();

        return rows
    } catch (error) {
        return error
    }
};

export const increaseViewChapterHandle = async ({ novelSlug, chapterNumber, views } : ChapterType & { views: number }) => {
    try {
        const connection = await pool.getConnection();

        const qCreateChapter = `
            SELECT views = ? FROM chapters
            WHERE novelSlug = ? AND chapterNumber = ?
        `;

        const [rows] = await connection.query(qCreateChapter, [novelSlug, chapterNumber, views+1]);

        connection.release();

        return rows
    } catch (error) {
        return error
    }
};



