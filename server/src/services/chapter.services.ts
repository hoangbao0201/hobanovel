import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../library/connectMySQL";

export const getDataChapterByUrlMTCHandle = async ({ slug, chapterNumber } : any) => {
    try {
        // Get Data Chapter
        let urlChapter = `https://metruyencv.com/truyen/${slug}/chuong-${chapterNumber}`
 
        const response = await axios.get(urlChapter);
        const $1 = cheerio.load(response.data);

        let title = $1('div.nh-read__title').text()
        const titleIndex = title.indexOf(":")
        const convertTitle = title.slice(titleIndex+1).trim();

        const dataChapter = {
            novelSlug: slug,
            title: convertTitle,
            content: $1('div#article').html(),
            chapterNumber: Number(chapterNumber),
        }

        return dataChapter

    } catch (error) {
        return null
    }
}

export const createChapterByDataHandle = async (data : any) => {
    try {
        const connection = await pool.getConnection();

        const {
            novelSlug, novelName, title, content, chapterNumber, novelId
        } = data
        
        const qCreateChapter = `
            INSERT INTO chapters(novelSlug, novelName, title, content, chapterNumber, novelId)
            VALUES (?)
        `;

        const values = [ novelSlug, novelName, title, content, chapterNumber, novelId ]

        const [rows] = await connection.query(qCreateChapter, [values]);

        connection.release();

        return rows
    } catch (error) {
        return error
    }
};

export const getChapterDetailHandle = async ({ slug, chapterNumber } : any) => {
    try {
        const connection = await pool.getConnection();

        const qCreateChapter = `
            SELECT chapterId, novelName, novelSlug, title, content, chapterNumber, view, updatedAt, novelId FROM chapters
            WHERE novelSlug = ? AND chapterNumber = ?
        `;

        const [rows] = await connection.query(qCreateChapter, [slug, chapterNumber]);

        connection.release();

        return rows
    } catch (error) {
        return error
    }
};
