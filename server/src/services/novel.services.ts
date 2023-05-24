import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../library/connectMySQL";


import { HistoryReadingType, NovelType } from "../types";
import { uploadThumbnailNovelByUrlHandle } from "./image.services";
import { getBlurDataURL } from "../utils/getBlurDataURL";
import { NovelSearchConditions } from "../middleware/conditionsQuery";

export const createNovelByDataHandle = async (data : NovelType, userId : string) => {
    try {
        const connection = await pool.getConnection();

        const qCreateNovel = `
            INSERT INTO novels(slug, title, thumbnailUrl, thumbnailPublicId, description, author, category, personality, scene, classify, viewFrame, userId)
            VALUES (?)
        `;

        const {
            slug, title, description, author, category, personality, scene, classify, viewFrame
        } = data
         
        const values = [slug, title, data?.thumbnailUrl || null, data?.thumbnailPublicId || null, description, author, category, personality, scene, classify, viewFrame, userId]

        // return values

        const [rows] = await connection.query(qCreateNovel, [values]);

        connection.release();

        return rows as NovelType[]
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
            // slug: convertTextToSlug($1('h1.h3.mr-2>a').text()),
            slug: url.split("com/truyen/")[1],
            description: $1('div.content').html(),
            author: $1('ul.list-unstyled.mb-4>li').eq(0).find('a').text().trim(),
            category: $1('ul.list-unstyled.mb-4>li').eq(2).find('a').text().trim(),
            personality: $1('ul.list-unstyled.mb-4>li').eq(3).find('a').text().trim(),
            scene: $1('ul.list-unstyled.mb-4>li').eq(4).find('a').text().trim(),
            classify: $1('ul.list-unstyled.mb-4>li').eq(5).find('a').text().trim(),
            viewFrame: $1('ul.list-unstyled.mb-4>li').eq(6).find('a').text().trim(),
            chapterNumber: $1('#nav-tab-chap .counter').text()
        }

        if(!dataNovel.title || !dataNovel.slug || !dataNovel.description || !dataNovel.author) {
            return null
        }

        const checkNovel : NovelType[] | null = await getNovelByTitleHandle(dataNovel.title as any);
        if(checkNovel?.length) {
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

export const getNovelByTitleHandle = async ({ title } : NovelType) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, slug, title, author, category, personality, scene, classify, viewFrame FROM novels
            WHERE title like ?
            LIMIT 10
        `;

        const [rows] = await connection.query(qGetNovel, [`%${title}%`]);

        connection.release();

        return rows as NovelType[]
    } catch (error) {
        return null
    }
};

export const getNovelsByPageHandle = async (page : any) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, slug, title, LEFT(description, 150) as description, thumbnailUrl, imageBlurHash, 
                thumbnailPublicId, author, category, personality, scene, classify, viewFrame FROM novels
            ORDER BY createdAt DESC
            LIMIT 6 OFFSET ?;
        `;

        const [rows] = await connection.query(qGetNovel, [(page-1)*6]);

        connection.release();

        return rows as NovelType[]
    } catch (error) {
        return null
    }
};

export const getNovelBySlugHandle = async ({ slug } : NovelType) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novels.novelId, novels.slug, novels.title, novels.thumbnailUrl, novels.imageBlurHash, novels.description, novels.author,
                AVG(reviews.mediumScore) AS mediumScore, 
                novels.category, novels.personality, novels.scene, novels.classify, novels.viewFrame,
                
                COUNT(IF(chapters.createdAt >= DATE_SUB(NOW(), INTERVAL 1 WEEK), 1, NULL)) as newChapterCount,
                chapterCount,
                SUM(chapters.views) AS views,
                history_reading.chapterRead
            
                FROM novels
                LEFT JOIN chapters ON chapters.novelId = novels.novelId
                LEFT JOIN reviews ON reviews.novelId = novels.novelId AND reviews.isRating = True
                LEFT JOIN history_reading ON history_reading.novelId = novels.novelId AND history_reading.userId = 1
            
            WHERE novels.slug = ?
            GROUP BY novels.novelId;
        `;
                // LEFT JOIN history_reading ON history_reading.novelId = novels.novelId AND history_reading.userId = novels.novelId
                // history_reading.chapterRead

        const [rows] = await connection.query(qGetNovel, [slug]);

        connection.release();

        return {
            success: true,
            data: rows as NovelType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};

export const getNovelsByUserIdHandle = async ({ userId } : NovelType) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, slug, title, author, updatedAt FROM novels
            WHERE userId = ?
        `;

        const [rows] = await connection.query(qGetNovel, [userId]);

        connection.release();

        return rows as NovelType[]
    } catch (error) {
        return null
    }
};

export const getChaptersNovelBySlugHandle = async ({ slug } : NovelType) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT chapterId, novelSlug, title, chapterNumber, createdAt FROM chapters
            WHERE novelSlug = ?
            ORDER BY chapterNumber ASC
        `;

        const [rows] = await connection.query(qGetNovel, [slug]);

        connection.release();

        return rows as NovelType[]
    } catch (error) {
        return null
    }
};

export const getNovelsByOutstandingHandle = async (page : number) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT N.novelId, N.slug, N.title, N.thumbnailUrl, N.imageBlurHash, LEFT(N.description, 150) as description, N.author, N.category, N.createdAt, SUM(chapters.views) AS views FROM novels N
                INNER JOIN chapters ON chapters.novelId = N.novelId
            GROUP BY N.novelId, N.slug, N.title, N.thumbnailUrl, N.imageBlurHash, description, N.author, N.category, N.createdAt
            ORDER BY views DESC
            LIMIT 6 OFFSET ?
        `;

        const [rows] = await connection.query(qGetNovel, ((page-1)*6));

        connection.release();

        return {
            success: true,
            data: rows as NovelType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};

export const getNovelsByHighlyRatedHandle = async (page : number) => {
    try {
        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT N.novelId, N.slug, N.title, N.thumbnailUrl, N.imageBlurHash, LEFT(N.description, 150) as description, N.author, N.category, N.createdAt, FORMAT(AVG(reviews.mediumScore), 1) AS mediumScore FROM novels N
                INNER JOIN reviews ON reviews.novelId = N.novelId
            GROUP BY N.novelId, N.slug, N.title, N.thumbnailUrl, N.imageBlurHash, description, N.author, N.category, N.createdAt
            ORDER BY mediumScore DESC
            LIMIT 6 OFFSET ?
        `;

        const [rows] = await connection.query(qGetNovel, ((page-1)*6));

        connection.release();

        return {
            success: true,
            data: rows as NovelType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};

export const updateBlurImageNovelHandle = async ({ novelId, imageBlurHash } : NovelType) => {
    try {
        const connection = await pool.getConnection();

        const qGetBanners = `
            UPDATE novels
            SET imageBlurHash = ?
            WHERE novelId = ?
        `;

        const [rows] = await connection.query(qGetBanners, [imageBlurHash, novelId]);

        connection.release();

        return {
            success: true,
            data: rows as NovelType[]
        }

    } catch (error) {
        return null
    }
};

export const updateAllBlurImageNovelHandle = async () => {
    try {

        const connection = await pool.getConnection();

        const qGetAllNovel = `
            SELECT novels.novelId, novels.thumbnailUrl FROM novels
        `;
            // WHERE novels.imageBlurHash IS NULL

        const [rows] : any = await connection.query(qGetAllNovel);

        
        connection.release();
        
        for(const novel of rows) {
            const hashUrl = await getBlurDataURL(novel.thumbnailUrl) || "";
            if(!hashUrl) {
                continue;
            }
            await updateBlurImageNovelHandle({ novelId: novel.novelId, imageBlurHash: hashUrl } as NovelType);
        }

        return {
            success: true,
            data: "123"
        }

    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};

export const getNovelsByDataHanle = async (data : NovelType & { page: number }) => {
    try {
        const { conditions, params } = NovelSearchConditions(data);

        const connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, title, slug, thumbnailUrl, imageBlurHash FROM novels
            ${conditions.length>0 ? ( "WHERE " + conditions) : ''}
            ORDER BY createdAt ASC
            LIMIT 5 OFFSET ?;
        `;

        const [rows] = await connection.query(qGetNovel, [...params, (Number(data.page) - 1) * 5]);

        connection.release();

        return {
            success: true,
            data: rows as NovelType[],
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};

export const readingNovelHandle = async ({ novelId, userId, chapterRead } : HistoryReadingType) => {
    try {
        const connection = await pool.getConnection();

        const qUpdateReadingNovel = `
            UPDATE history_reading
            SET chapterRead = IF(chapterRead > ?, chapterRead, ?)
            WHERE novelId = ? AND userId = ?
        `;

        const [rows] : any = await connection.query(qUpdateReadingNovel, [chapterRead, chapterRead, novelId, userId]);

        if (rows.affectedRows === 0) {
            const qCreateReadingNovel = `
                INSERT INTO history_reading (novelId, userId, chapterRead)
                VALUES (?, ?, ?)
            `;

            await connection.query(qCreateReadingNovel, [novelId, userId, chapterRead]);
        }

        connection.release();

        return {
            success: true,
            data: rows.affectedRows === 0  ? "Tạo reading" : "Update Reading",
        };
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};

export const getReadingNovelHandle = async ({ userId, page } : HistoryReadingType & { page: number }) => {
    try {
        const connection = await pool.getConnection();

        const qUpdateReadingNovel = `
            SELECT history_reading.*, novels.slug, novels.title, novels.chapterCount, novels.imageBlurHash, novels.thumbnailUrl FROM history_reading
                LEFT JOIN novels ON novels.novelId = history_reading.novelId
            WHERE history_reading.userId = ?
            ORDER BY updatedAt DESC
            LIMIT 5 OFFSET ?
        `;

        const [rows] : any = await connection.query(qUpdateReadingNovel, [userId, (page-1)*5]);

        connection.release();

        return {
            success: true,
            data: rows as HistoryReadingType[]
        };
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};