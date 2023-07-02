import { ReviewSearchConditions } from "../middleware/conditionsQuery";
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

export const getReviewsByNovelHandle = async (data : ReviewType & { page: number }) => {
    try {
        const connection = await pool.getConnection();

        const { conditions, params } = ReviewSearchConditions(data);
        
        const qGetComment = `
            SELECT reviews.*, users.name, users.username, users.avatarUrl, users.rank, users.userId, novels.title, novels.slug, countReplyReview.count AS countReplyReview
            FROM reviews

                INNER JOIN users ON users.userId = reviews.userId
                LEFT JOIN (
                    SELECT COUNT(*) AS count, reviews.parentId FROM reviews
                    WHERE reviews.parentId IS NOT NULL
                    GROUP BY reviews.parentId
                ) AS countReplyReview ON countReplyReview.parentId = reviews.reviewId
                LEFT JOIN novels ON novels.novelId = reviews.novelId

            WHERE reviews.parentId IS NULL ${conditions.length>0 ? `AND ${conditions}` : ''}
            ORDER BY reviews.createdAt DESC
            LIMIT 3 OFFSET ?;
        `;

        const [rows] = await connection.query(qGetComment, [...params, (Number(data.page) - 1) * 10]);

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

export const checkReviewExistenceHandle = async ({ userId, novelId } : ReviewType) => {
    try {
        const connection = await pool.getConnection();
        
        const qGetComment = `
            SELECT 1 FROM reviews
            WHERE isRating = True AND reviews.userId = ? AND reviews.novelId = ?
        `;

        const [rows] = await connection.query(qGetComment, [userId, novelId]);

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
            SELECT reviews.*, us_sender.name as senderName, us_sender.username as senderUsername, us_sender.userId as senderId, us_sender.avatarUrl as senderAvatarUrl, us_sender.rank as senderRank,
                us_receiver.name as receiverName, us_receiver.userId as receiverId, us_receiver.username as receiverUsername FROM reviews
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
