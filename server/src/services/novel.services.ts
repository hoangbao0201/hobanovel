import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../library/connectMySQL";


import { convertTextToSlug } from "../utils/convertTextToSlug";
import { uploadThumbnailNovelByUrlHandle } from "./image.services";

export const createNovelByDataHandle = async (data : any, userId : any) => {
    try {
        const connection = await pool.getConnection();

        const qCreateNovel = `
            INSERT INTO novels(slug, title, thumbnailUrl, thumbnailPublicId, description, author, category, personality, scene, classify, viewFrame, userId)
            VALUES (?)
        `;

        const {
            title, description, author, category, personality, scene, classify, viewFrame
        } = data
         
        const hashTitle = convertTextToSlug(title as string)
        const values = [hashTitle, title, data?.thumbnailUrl || null, data?.thumbnailPublicId || null, description, author, category, personality, scene, classify, viewFrame, userId]

        // return values

        const [rows] = await connection.query(qCreateNovel, [values]);

        connection.release();

        return rows
    } catch (error) {
        return error
    }
};

export const getDataNovelByUrlMTCHandle = async (url : string) => {
    try {
        const response1 = await axios.get(url);
        const $1 = cheerio.load(response1.data);

        const dataNovel = {
            title: $1('h1.h3.mr-2>a').text().trim(),
            slug: convertTextToSlug($1('h1.h3.mr-2>a').text()),
            description: $1('div.content').html(),
            author: $1('ul.list-unstyled.mb-4>li').eq(0).find('a').text().trim(),
            category: $1('ul.list-unstyled.mb-4>li').eq(2).find('a').text().trim(),
            personality: $1('ul.list-unstyled.mb-4>li').eq(3).find('a').text().trim(),
            scene: $1('ul.list-unstyled.mb-4>li').eq(4).find('a').text().trim(),
            classify: $1('ul.list-unstyled.mb-4>li').eq(5).find('a').text().trim(),
            viewFrame: $1('ul.list-unstyled.mb-4>li').eq(6).find('a').text().trim(),
        }

        if(!dataNovel.title || !dataNovel.slug || !dataNovel.description || !dataNovel.author) {
            return null
        }

        const checkNovel : any = await getNovelByTitleHandle(dataNovel.title);
        if(checkNovel.length) {
            return null
        }

        const urlImage = $1('.nh-thumb--210 img').attr('src');
        const thumbnailImage = await uploadThumbnailNovelByUrlHandle(urlImage as string);
        if(!thumbnailImage) {
            return null
        }

        return {
            ...dataNovel,
            thumbnailUrl: thumbnailImage?.url || null,
            thumbnailPublicId: thumbnailImage?.public_id || null,
        }
    } catch (error) {
        return null
    }
}

export const getNovelByTitleHandle = async (title : any) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, slug, title, author, category, personality, scene, classify, viewFrame FROM novels
            WHERE title like ?
            LIMIT 10
        `;

        const [rows] = await connection.query(qGetNovel, [`%${title}%`]);

        connection.release();

        return rows
    } catch (error) {
        return null
    }
};

export const getNovelsByPageHandle = async (page : any) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, slug, title, thumbnailUrl, thumbnailPublicId, author, category, personality, scene, classify, viewFrame FROM novels
            ORDER BY createdAt DESC
            LIMIT 10 OFFSET ?;
        `;

        const [rows] = await connection.query(qGetNovel, [(page-1)*10]);

        connection.release();

        return rows
    } catch (error) {
        return null
    }
};

export const getNovelBySlugHandle = async (slug : any) => {
    try {
        const connection = await pool.getConnection();


        // SELECT COUNT(chapters.chapterId) AS chapterCount, novels.novelId, novels.slug, novels.title, novels.thumbnailUrl, novels.description, novels.author, novels.category, novels.personality, novels.scene, novels.classify, viewFrame FROM
        //     novels 
        //     LEFT JOIN chapters ON chapters.novelId = novels.novelId 
        // WHERE novels.slug = ? 
        // GROUP BY novels.novelId;
        const qGetNovel = `
            SELECT novels.novelId, novels.slug, novels.title, novels.thumbnailUrl, novels.description, novels.author, 
                novels.category, novels.personality, novels.scene, novels.classify, novels.viewFrame,

                COUNT(IF(chapters.createdAt >= DATE_SUB(NOW(), INTERVAL 1 WEEK), 1, NULL)) as newChapterCount,
                COUNT(chapters.chapterId) as totalChapterCount

                FROM novels
                LEFT JOIN chapters ON chapters.novelId = novels.novelId

            WHERE novels.slug = ? 
            GROUP BY novels.novelId;
        `;

        const [rows] = await connection.query(qGetNovel, [slug]);

        connection.release();

        return rows
    } catch (error) {
        return null
    }
};

export const getNovelsByUserIdHandle = async (userId : any) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, slug, title, author, updatedAt FROM novels
            WHERE userId = ?
        `;

        const [rows] = await connection.query(qGetNovel, [userId]);

        connection.release();

        return rows
    } catch (error) {
        return null
    }
};

export const getChaptersNovelBySlugHandle = async (slug : any) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT chapterId, novelSlug, title, chapterNumber, view, updatedAt, novelId FROM chapters
            WHERE novelSlug = ?
            ORDER BY chapterNumber ASC
        `;

        const [rows] = await connection.query(qGetNovel, [slug]);

        connection.release();

        return rows
    } catch (error) {
        return null
    }
};


