import pool from "../library/connectMySQL";

import { NovelType, ReviewType } from "../types";

export const addReviewByNovelHandle = async ({
    novelId,
    userId,
    dataFeelback,
}: NovelType & { dataFeelback: ReviewType }) => {
    try {
        const connection = await pool.getConnection();

        const qGetUser = `
            INSERT INTO reviews(mediumScore, pointStoryline, pointPersonality, pointScene, pointTranslation, commentText, isSpoiler, userId, novelId)
            VALUES (?,?,?,?,?,?,?,?,?);
        `;

        const [rows] = await connection.query(qGetUser, [
            dataFeelback.mediumScore,
            dataFeelback.pointStoryline,
            dataFeelback.pointPersonality,
            dataFeelback.pointScene,
            dataFeelback.pointTranslation,
            dataFeelback.commentText,
            dataFeelback.isSpoiler,
            userId,
            novelId,
        ]);

        connection.release();

        return {
            success: true,
            data: rows as ReviewType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};

export const getReviewByLatestHandle = async (page : number) => {
    try {
        const connection = await pool.getConnection();

        const qGetReview = `
            SELECT reviews.*, users.name, users.userId, novels.title, novels.slug FROM reviews
                LEFT JOIN users ON users.userId = reviews.userId
                LEFT JOIN novels ON novels.novelId = reviews.novelId
            ORDER BY reviews.createdAt DESC
            LIMIT 3 OFFSET ?
        `;

        const [rows] = await connection.query(qGetReview, [(Number(page) - 1) * 3]);

        connection.release();

        return {
            success: true,
            data: rows as ReviewType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};
export const getReviewByNovelHandle = async ({
    novelId,
    page,
}: NovelType & { page: number }) => {
    try {
        const connection = await pool.getConnection();

        const qGetReview = `
            SELECT reviews.*, users.name, users.userId FROM reviews
                INNER JOIN users ON users.userId = reviews.userId
            WHERE reviews.novelId = ?
            ORDER BY reviews.createdAt DESC
            LIMIT 10 OFFSET ?
        `;

        const [rows] = await connection.query(qGetReview, [
            Number(novelId),
            [(Number(page) - 1) * 10],
        ]);

        connection.release();

        return {
            success: true,
            data: rows as ReviewType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};
export const destroyReviewByNovelHandle = async ({ reviewId, userId } : ReviewType) => {
    try {
        const connection = await pool.getConnection();

        const qGetReview = `
            DELETE FROM reviews
            WHERE reviews.reviewId = ? AND reviews.userId = ?
        `;

        const [rows] = await connection.query(qGetReview, [reviewId, userId]);

        connection.release();

        return {
            success: true,
            data: rows as ReviewType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};
