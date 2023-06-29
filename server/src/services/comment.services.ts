import pool from "../library/connectMySQL";
import { CommentSearchConditions } from "../middleware/conditionsQuery";

import { CommentType } from "../types";

export const addCommentByNovelHandle = async (data: CommentType ) => {
    try {
        const connection = await pool.getConnection();

        const { params, values } = CommentSearchConditions(data);

        const qGetUser = `
            INSERT INTO comments(${values})
            VALUES (?);
        `;

        const [rows] = await connection.query(qGetUser, [params]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
            // data: values
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
            SELECT comments.*, users.name, users.username, users.rank, users.userId, countReplyComment.count AS countReplyComment
            FROM comments
            INNER JOIN users ON users.userId = comments.userId
            LEFT JOIN (
                SELECT COUNT(*) AS count, comments.parentId FROM comments
                WHERE comments.parentId IS NOT NULL
                GROUP BY comments.parentId
            ) AS countReplyComment ON countReplyComment.parentId = comments.commentId
            ${conditions.length>0 ? ( "WHERE " + conditions) : 'WHERE comments.parentId IS NULL'}
            ORDER BY comments.createdAt DESC
            LIMIT 10 OFFSET ?;
        `;

        const [rows] = await connection.query(qGetComment, [...params, (Number(data.page) - 1) * 10]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
            // data: {conditions, params}
            // data: qGetComment
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
            WHERE comments.commentId = ? AND comments.userId = ? AND comments.parentId IS NULL
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
            WHERE comments.commentId = ? AND comments.userId = ? AND comments.parentId IS NOT NULL
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

export const addReplyCommentHandle = async (data : CommentType) => {
    try {
        const connection = await pool.getConnection();

        const qAddComment = `
            INSERT INTO comments(userId, parentId, commentText)
            VALUES (?, ?, ?)
        `;

        const [rows] = await connection.query(qAddComment, [data.userId, data.commentId, data.commentText]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
            // data: qGetReview
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
};

export const getReplyCommentHandle = async (data : CommentType & { page: number }) => {
    try {
        const connection = await pool.getConnection();

        const qGetComment = `
            SELECT comments.*, us_sender.name as senderName, us_sender.userId as senderId,
                us_receiver.name as receiverName, us_receiver.userId as receiverId FROM comments
                LEFT JOIN users us_sender ON us_sender.userId = comments.userId
                LEFT JOIN comments rv ON rv.commentId = comments.parentId
                LEFT JOIN users us_receiver ON us_receiver.userId = rv.userId
            WHERE comments.parentId = ?
            ORDER BY comments.createdAt ASC
            LIMIT 5 OFFSET ?
        `;

        const [rows] = await connection.query(qGetComment, [data.commentId, (Number(data.page) - 1) * 5]);

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
