import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../library/connectMySQL";


import { HistoryReadingType, NovelFollowerType, NovelType } from "../types";
import { getBlurDataURL } from "../utils/getBlurDataURL";
import { NovelSearchConditions, fieldGetNovel, getAdvancedNovelConditions } from "../middleware/conditionsQuery";
import { PROPERTIES_NOVEL } from "../constants";


export const createNovelByDataHandle = async (data : NovelType, userId : string) => {
    let connection;
    try {
        const {
            slug, title, description, author, category, personality, scene, classify, viewFrame
        } = data

        connection = await pool.getConnection();

        const qCreateNovel = `
            INSERT INTO novels(slug, title, description, author, category, personality, scene, classify, viewFrame, userId)
            VALUES (?)
        `;
         
        const values = [slug, title, description, author, category || null, personality || null, scene || null, classify || null, viewFrame || null, userId]

        const [rows] = await connection.query(qCreateNovel, [values]);

        return {
            success: true,
            data: rows as NovelType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error?.message
        }
    } finally {
        if (connection) connection.release();
    }
};

export const getDataNovelByUrlMTCHandle = async (url : string) => {
    try {
        const response1 = await axios.get(url);
        const $1 = cheerio.load(response1.data);

        const dataNovel : any = {
            title: $1('h1.h3.mr-2>a').text().trim(),
            slug: url.split("com/truyen/")[1],
            description: $1('div.content').html(),
            author: $1('ul.list-unstyled.mb-4>li').eq(0).find('a').text().trim(),

            category: $1('ul.list-unstyled.mb-4>li').eq(2).find('a').text().trim(),
            personality: $1('ul.list-unstyled.mb-4>li').eq(3).find('a').text().trim(),
            scene: $1('ul.list-unstyled.mb-4>li').eq(4).find('a').text().trim(),
            classify: $1('ul.list-unstyled.mb-4>li').eq(5).find('a').text().trim(),
            viewFrame: $1('ul.list-unstyled.mb-4>li').eq(6).find('a').text().trim(),

            chapterCount: $1('#nav-tab-chap .counter').text()
        }

        if(!dataNovel.title || !dataNovel.slug || !dataNovel.description || !dataNovel.author) {
            throw new Error("Missing attribute");
        }

        const urlImage = $1('.nh-thumb--210 img').attr('src');
        // const thumbnailImage = await uploadThumbnailNovelByUrlHandle(urlImage as string);
        // if(!thumbnailImage) {
        //     return null
        // }

        // convert attribute
        if(dataNovel.category) {
            const ob = PROPERTIES_NOVEL['genres'].find(item => {
                return item.value === dataNovel.category
            })
            dataNovel.category = ob?.id || undefined
        }
        if(dataNovel.personality) {
            const ob = PROPERTIES_NOVEL['personality'].find(item => {
                return item.value === dataNovel.personality
            })
            dataNovel.personality = ob?.id || undefined
        }
        if(dataNovel.scene) {
            const ob = PROPERTIES_NOVEL['scene'].find(item => {
                return item.value === dataNovel.scene
            })
            dataNovel.scene = ob?.id || undefined
        }
        if(dataNovel.classify) {
            const ob = PROPERTIES_NOVEL['classify'].find(item => {
                return item.value === dataNovel.classify
            })
            dataNovel.classify = ob?.id || undefined
        }
        if(dataNovel.viewFrame) {
            const ob = PROPERTIES_NOVEL['viewFrame'].find(item => {
                return item.value === dataNovel.viewFrame
            })
            dataNovel.viewFrame = ob?.id || undefined
        }

        return {
            success: true,
            data: {
                ...dataNovel,
                urlImage: urlImage
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error?.message
        }
    }
}

export const getChapterCountNovelHandle = async (url: string) => {
    const response1 = await axios.get(url);
    const $1 = cheerio.load(response1.data);
    return Number($1('#nav-tab-chap .counter').text()) || 0
}

export const getNovelByTitleHandle = async ({ title } : NovelType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, slug, title, author, category, personality, scene, classify, viewFrame FROM novels
            WHERE title like ?
            LIMIT 10
        `;

        const [rows] = await connection.query(qGetNovel, [`%${title}%`]);

        return rows as NovelType[]
    } catch (error) {
        return null
    } finally {
        if (connection) connection.release();
    }
};

export const checkNovelExistedHandle = async (slug : string) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, slug, title, chapterCount FROM novels
            WHERE slug = ?
            LIMIT 1
        `;

        const [rows] = await connection.query(qGetNovel, slug);

        return {
            success: true,
            data: rows as NovelType[]
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

export const getNovelsByPageHandle = async (page : any) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, slug, title, LEFT(description, 150) as description, thumbnailUrl, imageBlurHash, 
                thumbnailPublicId, author, category, personality, scene, classify, viewFrame FROM novels
            ORDER BY createdAt DESC
            LIMIT 6 OFFSET ?;
        `;

        const [rows] = await connection.query(qGetNovel, [(page-1)*6]);

        return rows as NovelType[]
    } catch (error) {
        return null
    } finally {
        if (connection) connection.release();
    }
};

export const getNovelBySlugHandle = async ({ slug } : NovelType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novels.novelId, novels.slug, novels.title, novels.thumbnailUrl, novels.imageBlurHash, novels.description, novels.author,
                novels.category, novels.personality, novels.scene, novels.classify, novels.viewFrame, novels.createdAt, novels.chapterCount,

                (SELECT COALESCE(SUM(chapters.views), 0) FROM chapters chapters WHERE chapters.novelId = novels.novelId) AS views,

                (SELECT COALESCE(COUNT(DISTINCT chapters.chapterId), 0) FROM chapters chapters WHERE chapters.novelId = novels.novelId) AS chapterCount,
                
                (SELECT COUNT(IF(chapters.createdAt >= DATE_SUB(NOW(), INTERVAL 1 WEEK), 1, NULL)) FROM chapters chapters WHERE chapters.novelId = novels.novelId) AS newChapterCount,
                
                (SELECT COALESCE(AVG(reviews.mediumScore), 5) FROM reviews WHERE reviews.novelId = novels.novelId AND reviews.parentId IS NULL) AS mediumScore,
                
                (SELECT COALESCE(history_reading.chapterRead, 1) FROM history_reading WHERE history_reading.novelId = novels.novelId AND history_reading.userId = 1) AS chapterRead,
                
                (SELECT COALESCE(COUNT(DISTINCT novel_followers.userId), 0) FROM novel_followers WHERE novel_followers.novelId = novels.novelId) AS followerCount
                
            FROM novels

            WHERE novels.slug = ?
        `;

        const [rows] = await connection.query(qGetNovel, [slug]);

        return {
            success: true,
            data: rows as NovelType[]
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

export const getNovelsByUserIdHandle = async ({ userId } : NovelType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetNovel = `
            SELECT novelId, slug, title, author, updatedAt FROM novels
            WHERE userId = ?
        `;

        const [rows] = await connection.query(qGetNovel, [userId]);

        return rows as NovelType[]
    } catch (error) {
        return null
    } finally {
        if (connection) connection.release();
    }
};

export const getChaptersNovelBySlugHandle = async ({ slug } : NovelType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetNovel = `
            SELECT chapterId, novelSlug, title, chapterNumber, createdAt FROM chapters
            WHERE novelSlug = ?
            ORDER BY chapterNumber ASC
        `;

        const [rows] = await connection.query(qGetNovel, [slug]);

        return rows as NovelType[]
    } catch (error) {
        return null
    } finally {
        if (connection) connection.release();
    }
};

export const getNovelsByOutstandingHandle = async (page : number) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetNovel = `
            SELECT N.novelId, N.slug, N.title, N.thumbnailUrl, N.imageBlurHash, LEFT(N.description, 150) as description, N.author, N.category, N.createdAt, SUM(chapters.views) AS views FROM novels N
                INNER JOIN chapters ON chapters.novelId = N.novelId
            GROUP BY N.novelId, N.slug, N.title, N.thumbnailUrl, N.imageBlurHash, description, N.author, N.category, N.createdAt
            ORDER BY views DESC
            LIMIT 6 OFFSET ?
        `;

        const [rows] = await connection.query(qGetNovel, ((page-1)*6));

        return {
            success: true,
            data: rows as NovelType[]
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

export const getNovelsByHighlyRatedHandle = async (page : number) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetNovel = `
            SELECT N.novelId, N.slug, N.title, N.thumbnailUrl, N.imageBlurHash, N.chapterCount, LEFT(N.description, 150) as description, N.author, N.category, N.createdAt, FORMAT(AVG(reviews.mediumScore), 1) AS mediumScore FROM novels N
                LEFT JOIN reviews ON reviews.novelId = N.novelId
            GROUP BY N.novelId, N.slug, N.title, N.thumbnailUrl, N.imageBlurHash, description, N.author, N.category, N.createdAt
            ORDER BY mediumScore DESC
            LIMIT 6 OFFSET ?
        `;

        const [rows] = await connection.query(qGetNovel, ((page-1)*6));

        return {
            success: true,
            data: rows as NovelType[]
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

export const updateBlurImageNovelHandle = async ({ novelId, imageBlurHash } : NovelType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetBanners = `
            UPDATE novels
            SET imageBlurHash = ?
            WHERE novelId = ?
        `;

        const [rows] = await connection.query(qGetBanners, [imageBlurHash, novelId]);

        return {
            success: true,
            data: rows as NovelType[]
        }

    } catch (error) {
        return null
    } finally {
        if (connection) connection.release();
    }
};

export const updateAllBlurImageNovelHandle = async () => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetAllNovel = `
            SELECT novels.novelId, novels.thumbnailUrl FROM novels
        `;

        const [rows] : any = await connection.query(qGetAllNovel);
        
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
    } finally {
        if (connection) connection.release();
    }
};

export const getNovelsByDataHanle = async (data : NovelType & { page: number }) => {
    let connection;
    try {
        const { conditions, params } = NovelSearchConditions(data);

        connection = await pool.getConnection();

        const qGetNovel = `            
            SELECT novels.novelId, novels.title, novels.slug, novels.thumbnailUrl, novels.imageBlurHash, novels.category, novels.personality, novels.scene, novels.classify,
                novels.viewFrame, COUNT(chapters.novelId) as chapterCount
                FROM novels
                LEFT JOIN chapters ON chapters.novelId = novels.novelId
            ${conditions.length>0 ? ( "WHERE " + conditions) : ''}
            GROUP BY novels.novelId, novels.title
            ORDER BY novels.createdAt DESC
            LIMIT 5 OFFSET ?;
        `;

        const [rows] = await connection.query(qGetNovel, [...params, (Number(data.page) - 1) * 5]);

        return {
            success: true,
            data: rows as NovelType[],
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

export const readingNovelHandle = async ({ novelId, userId, chapterRead } : HistoryReadingType) => {
    let connection;
    try {
        connection = await pool.getConnection();

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

        return {
            success: true,
            data: rows.affectedRows === 0  ? "Tạo reading" : "Update Reading",
        };
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
};

export const getReadingNovelHandle = async ({ userId, page } : HistoryReadingType & { page: number }) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qUpdateReadingNovel = `
            SELECT history_reading.*, novels.slug, novels.title, novels.chapterCount, novels.imageBlurHash, novels.thumbnailUrl FROM history_reading
                LEFT JOIN novels ON novels.novelId = history_reading.novelId
            WHERE history_reading.userId = ?
            ORDER BY updatedAt DESC
            LIMIT 5 OFFSET ?
        `;

        const [rows] : any = await connection.query(qUpdateReadingNovel, [userId, (page-1)*5]);

        return {
            success: true,
            data: rows as HistoryReadingType[]
        };
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
};

// Follow Novel

export const getFollowsNovelHandle = async ({ userId, page } : Pick<NovelFollowerType, 'userId'> & { page: number }) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetFollowsNovel = `
            SELECT ${fieldGetNovel} FROM novel_followers 
                LEFT JOIN novels ON novels.novelId = novel_followers.novelId
                LEFT JOIN users ON users.userId = novels.userId
            WHERE novel_followers.userId = ?
            ORDER BY novels.updatedAt DESC
            LIMIT 10 OFFSET ?
        `;

        const [rows] : any = await connection.query(qGetFollowsNovel, [userId, (page-1)*10]);

        return {
            success: true,
            data: rows
        };
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
};

export const followNovelHandle = async ({ userId, novelId } : NovelFollowerType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qUpdateReadingNovel = `
            INSERT INTO novel_followers(userId, novelId)
            VALUES (?, ?)
        `;

        const [rows] : any = await connection.query(qUpdateReadingNovel, [userId, novelId]);

        return {
            success: true,
            data: rows
        };
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
};

export const unfollowNovelHandle = async ({ userId, novelId } : NovelFollowerType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qUpdateReadingNovel = `
            DELETE FROM novel_followers
            WHERE userId = ? AND novelId = ?
        `;

        const [rows] : any = await connection.query(qUpdateReadingNovel, [userId, novelId]);

        return {
            success: true,
            data: rows
        };
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
};

export const getAdvancedNovelHandle = async (data: any) => {
    let connection;
    try {
        const { join, sort, params, conditions, page } = getAdvancedNovelConditions(data)
        
        connection = await pool.getConnection();

        // Get countPage
        const qGetCountPage = `
            SELECT COUNT(*) as countPage FROM novels
            ${conditions}
        `
        const [rowsGetCountPage] : any = await connection.query(qGetCountPage);

        // Get Novel
        const qGetNovel = `
            SELECT ${fieldGetNovel} FROM novels

            ${join}

            ${conditions}

            GROUP BY novels.novelId

            ${sort}

            LIMIT 20 OFFSET ${page}
        `

        const [rows] : any = await connection.query(qGetNovel, params);

        return {
            success: true,
            data: rows,
            countPage: rowsGetCountPage,
        }

    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
}

export const getAllNovelForSeoHandle = async () => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetAllNovel = `
            SELECT novels.novelId, novels.title, novels.slug, novels.createdAt, novels.updatedAt from novels
        `;

        const [rows] : any = await connection.query(qGetAllNovel);

        return {
            success: true,
            data: rows
        };
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
};

