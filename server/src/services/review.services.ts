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
            WHERE reviews.isRating = True
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
            SELECT reviews.*, users.name, users.userId, countReplyReview.count AS countReplyReview
            FROM reviews
            INNER JOIN users ON users.userId = reviews.userId
            LEFT JOIN (
                SELECT COUNT(*) AS count, reviews.parentId
                FROM reviews
                WHERE reviews.isRating = False
                GROUP BY reviews.parentId
            ) AS countReplyReview ON countReplyReview.parentId = reviews.reviewId
            WHERE reviews.novelId = ? AND reviews.isRating = True
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
            WHERE reviews.reviewId = ? AND reviews.userId = ? AND reviews.isRating = True
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

export const destroyReplyReviewByNovelHandle = async ({ reviewId, userId } : ReviewType) => {
    try {
        const connection = await pool.getConnection();

        const qGetReview = `
            DELETE FROM reviews
            WHERE reviews.reviewId = ? AND reviews.userId = ? AND reviews.isRating = False
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

export const addReplyReviewHandle = async ({ novelId, reviewId, userId, commentText } : ReviewType) => {
    try {
        const connection = await pool.getConnection();

        const qGetReview = `
            INSERT INTO reviews(isRating, commentText, parentId, userId, novelId)
            VALUES (?,?,?,?,?)
        `;

        const [rows] = await connection.query(qGetReview, [false, commentText, reviewId, userId, novelId]);

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

export const getReplyReviewHandle = async (reviewId : string) => {
    try {
        const connection = await pool.getConnection();

        const qGetReview = `
            SELECT reviews.*, us_sender.name as senderName, us_sender.userId as senderId,
                us_receiver.name as receiverName, us_receiver.userId as receiverId FROM reviews
                LEFT JOIN users us_sender ON us_sender.userId = reviews.userId
                LEFT JOIN reviews rv ON rv.reviewId = reviews.parentId
                LEFT JOIN users us_receiver ON us_receiver.userId = rv.userId
            WHERE reviews.parentId = ? AND reviews.isRating = False
            ORDER BY reviews.createdAt ASC
            LIMIT 5 OFFSET 0
        `;

        const [rows] = await connection.query(qGetReview, [reviewId]);

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
