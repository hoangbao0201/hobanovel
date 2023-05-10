import { BannersType } from "../types";
import pool from "../library/connectMySQL";

export const addBannerHandle = async (data : BannersType) => {
    try {
        const { novelId, bannersUrl, bannersPublicId } = data
        const connection = await pool.getConnection();

        const qAddBanners = `
            INSERT INTO banners(novelId, bannerUrl, bannerPublicId)
            VALUES (?,?,?)
        `;

        const [rows] = await connection.query(qAddBanners, [novelId, bannersUrl, bannersPublicId]);

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
            SELECT * FROM banners
            ORDER BY createdAt DESC
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