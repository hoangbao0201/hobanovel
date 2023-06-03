import { BannersType } from "../types";
import pool from "../library/connectMySQL";
import { getBlurDataURL } from "../utils/getBlurDataURL";

export const addBannerHandle = async (data : BannersType) => {
    try {
        const { novelId, bannersUrl, imageBlurHash, bannersPublicId, isMobile } = data
        const connection = await pool.getConnection();

        const qAddBanners = `
            INSERT INTO banners(novelId, bannersUrl, imageBlurHash, bannersPublicId, isMobile)
            VALUES (?,?,?,?,?)
        `;

        const [rows] = await connection.query(qAddBanners, [novelId, bannersUrl, imageBlurHash, bannersPublicId, isMobile]);

        connection.release();

        return {
            success: true,
            data: rows as BannersType[]
        }

    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};

export const getSingleBannerHandle = async (isMobile : boolean) => {
    try {
        const connection = await pool.getConnection();

        const qGetBanners = `
            SELECT banners.bannersId, banners.bannersUrl, banners.imageBlurHash, novels.slug FROM banners
                LEFT JOIN novels ON novels.novelId = banners.novelId
            WHERE banners.isMobile = ?
            ORDER BY RAND()
            LIMIT 1
        `;

        const [rows] = await connection.query(qGetBanners, isMobile);

        connection.release();

        return {
            success: true,
            data: rows as BannersType[]
        }

    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};
export const getMultipleBannerHandle = async (isMobile : boolean) => {
    try {
        const connection = await pool.getConnection();

        const qGetBanners = `
            SELECT banners.*, novels.title FROM banners
                INNER JOIN novels ON novels.novelId = banners.bannersId
            WHERE banners.isMobile = ?
            ORDER BY createdAt DESC
            LIMIT 6
        `;

        const [rows] = await connection.query(qGetBanners, isMobile);

        connection.release();

        return {
            success: true,
            data: rows as BannersType[]
        }

    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};

export const updateBlurImageBannersHandle = async ({ bannersId, imageBlurHash } : BannersType) => {
    try {
        const connection = await pool.getConnection();

        const qGetBanners = `
            UPDATE banners
            SET imageBlurHash = ?
            WHERE bannersId = ?
        `;

        const [rows] = await connection.query(qGetBanners, [imageBlurHash, bannersId]);

        connection.release();

        return {
            success: true,
            data: rows as BannersType[]
        }

    } catch (error) {
        return null
    }
};

export const updateAllBlurImageBannersHandle = async () => {
    try {

        const connection = await pool.getConnection();

        const qGetAllBanners = `
            SELECT banners.bannersId, banners.bannersUrl FROM banners
            WHERE banners.imageBlurHash IS NULL
        `;

        const [rows] : any = await connection.query(qGetAllBanners);
        
        connection.release();
        
        for(const banners of rows) {
            const hashUrl = await getBlurDataURL(banners.bannersUrl) || "";
            if(!hashUrl) {
                continue;
            }
            await updateBlurImageBannersHandle({ bannersId: banners.bannersId, imageBlurHash: hashUrl } as BannersType);
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