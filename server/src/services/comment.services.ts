import pool from "../library/connectMySQL";
import { CommentSearchConditions } from "../middleware/conditionsQuery";

import { CommentType } from "../types";

export const addCommentByNovelHandle = async ({
    novelId,
    chapterId,
    userId,
    commentText
}: CommentType ) => {
    try {
        const connection = await pool.getConnection();

        const qGetUser = `
            INSERT INTO comments(novelId, chapterId, userId, commentText)
            VALUES (?,?,?,?);
        `;

        const [rows] = await connection.query(qGetUser, [
            novelId,
            chapterId || null,
            userId,
            commentText
        ]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};

export const getCommentByLatestHandle = async (page : number) => {
    try {
        const connection = await pool.getConnection();

        const qGetComment = `
            SELECT comments.*, users.name, users.userId, novels.title, novels.slug FROM comments
                LEFT JOIN users ON users.userId = comments.userId
                LEFT JOIN novels ON novels.novelId = comments.novelId
            WHERE comments.isRating = True
            ORDER BY comments.createdAt DESC
            LIMIT 3 OFFSET ?
        `;

        const [rows] = await connection.query(qGetComment, [(Number(page) - 1) * 3]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};
export const getCommentByNovelHandle = async (data : CommentType & { page: number }) => {
    try {
        const connection = await pool.getConnection();

        const { conditions, params } = CommentSearchConditions(data);
        
        const qGetComment = `
            SELECT comments.*, users.name, users.userId, countReplyComment.count AS countReplyComment
            FROM comments
            INNER JOIN users ON users.userId = comments.userId
            LEFT JOIN (
                SELECT COUNT(*) AS count, comments.parentId FROM comments
                WHERE comments.parentId IS NOT NULL
                GROUP BY comments.parentId
            ) AS countReplyComment ON countReplyComment.parentId = comments.commentId
            ${conditions.length>0 ? ( "WHERE " + conditions ) : ''}
            ORDER BY comments.createdAt DESC
            LIMIT 10 OFFSET ?;
        `;

        const [rows] = await connection.query(qGetComment, [...params, (Number(data.page) - 1) * 10]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
            // data: data
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};
export const destroyCommentByNovelHandle = async ({ commentId, userId } : CommentType) => {
    try {
        const connection = await pool.getConnection();

        const qGetReview = `
            DELETE FROM comments
            WHERE comments.commentId = ? AND comments.userId = ?
        `;

        const [rows] = await connection.query(qGetReview, [commentId, userId]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};

export const destroyReplyCommentByNovelHandle = async ({ commentId, userId } : CommentType) => {
    try {
        const connection = await pool.getConnection();

        const qGetComment = `
            DELETE FROM comments
            WHERE comments.commentId = ? AND comments.userId = ?
        `;

        const [rows] = await connection.query(qGetComment, [commentId, userId]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};

export const addReplyCommentHandle = async ({ novelId, chapterId, userId, commentId, commentText } : CommentType) => {
    try {
        const connection = await pool.getConnection();

        const qGetReview = `
            INSERT INTO comments(novelId, chapterId, userId, commentId, commentText)
            VALUES (?,?,?,?,?)
        `;

        const [rows] = await connection.query(qGetReview, [novelId, chapterId, userId, commentId, commentText]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};

export const getReplyCommentHandle = async (reviewId : string) => {
    try {
        const connection = await pool.getConnection();

        const qGetComment = `
            SELECT comments.*, us_sender.name as senderName, us_sender.userId as senderId,
                us_receiver.name as receiverName, us_receiver.userId as receiverId FROM comments
                LEFT JOIN users us_sender ON us_sender.userId = comments.userId
                LEFT JOIN comments rv ON rv.commentId = comments.parentId
                LEFT JOIN users us_receiver ON us_receiver.userId = rv.userId
            WHERE comments.parentId IS NULL
            ORDER BY comments.createdAt ASC
            LIMIT 5 OFFSET 0
        `;

        const [rows] = await connection.query(qGetComment, [reviewId]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};
