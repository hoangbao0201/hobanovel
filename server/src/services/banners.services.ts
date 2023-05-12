import { BannersType } from "../types";
import pool from "../library/connectMySQL";
import { getBlurDataURL } from "../utils/getBlurDataURL";

export const addBannerHandle = async (data : BannersType) => {
    try {
        const { novelId, bannersUrl, imageBlurHash, bannersPublicId } = data
        const connection = await pool.getConnection();

        const qAddBanners = `
            INSERT INTO banners(novelId, bannersUrl, imageBlurHash, bannersPublicId)
            VALUES (?,?,?,?)
        `;

        const [rows] = await connection.query(qAddBanners, [novelId, bannersUrl, imageBlurHash, bannersPublicId]);

        connection.release();

        return {
            success: true,
            data: rows as BannersType[]
        }

    } catch (error) {
        return null
    }
};

export const getSingleBannerHandle = async () => {
    try {
        const connection = await pool.getConnection();

        const qGetBanners = `
            SELECT * FROM banners
            ORDER BY RAND()
            LIMIT 1
        `;

        const [rows] = await connection.query(qGetBanners);

        connection.release();

        return {
            success: true,
            data: rows as BannersType[]
        }

    } catch (error) {
        return null
    }
};
export const getMultipleBannerHandle = async () => {
    try {
        const connection = await pool.getConnection();

        const qGetBanners = `
            SELECT banners.*, novels.title FROM banners
            INNER JOIN novels ON novels.novelId = banners.bannersId
            ORDER BY createdAt DESC
            LIMIT 6
        `;

        const [rows] = await connection.query(qGetBanners);

        connection.release();

        return {
            success: true,
            data: rows as BannersType[]
        }

    } catch (error) {
        return null
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