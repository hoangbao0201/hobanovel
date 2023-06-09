import pool from "../library/connectMySQL";
import { CommentSearchConditions } from "../middleware/conditionsQuery";

import { CommentType } from "../types";

export const addCommentByNovelHandle = async (data: CommentType ) => {
    try {
        const connection = await pool.getConnection();

        const { into, values } = CommentSearchConditions(data);

        const qGetUser = `
            INSERT INTO comments(${values})
            VALUES (?);
        `;

        const [rows] = await connection.query(qGetUser, [into]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
            // data: values
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};

export const getCommentsHandle = async (data : Partial<CommentType> & { page: number }) => {
    try {
        const connection = await pool.getConnection();

        const { conditions, params } = CommentSearchConditions(data);
        
        const qGetComment = `
            SELECT comments.*, 
            us_sender.userId as senderId, comments.senderName as senderName, us_sender.username as senderUsername, us_sender.rank as senderRank, 
            countReplyComment.count AS countReplyComment

            FROM comments
            INNER JOIN users us_sender ON us_sender.userId = comments.senderId
            LEFT JOIN (
                SELECT COUNT(*) AS count, comments.parentId FROM comments
                WHERE comments.parentId IS NOT NULL
                GROUP BY comments.parentId
            ) AS countReplyComment ON countReplyComment.parentId = comments.commentId
            WHERE ${conditions}
            ORDER BY comments.createdAt DESC
            LIMIT 10 OFFSET ?;
        `;

        const [rows] = await connection.query(qGetComment, [...params, (Number(data.page) - 1) * 10]);

        connection.release();

        return {
            success: true,
            data: rows
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};
export const destroyCommentByNovelHandle = async ({ commentId, senderId } : CommentType) => {
    try {
        const connection = await pool.getConnection();

        const qGetReview = `
            DELETE FROM comments
            WHERE comments.commentId = ? ${ senderId == "1" ? "" : "AND comments.senderId = ?" } AND comments.parentId IS NULL
        `;

        const [rows] = await connection.query(qGetReview, [commentId, senderId]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};

export const destroyReplyCommentByNovelHandle = async ({ commentId, senderId } : CommentType) => {
    try {
        const connection = await pool.getConnection();

        const qGetComment = `
            DELETE FROM comments
            WHERE comments.commentId = ? ${ senderId == "1" ? "" : "AND comments.senderId = ?" } AND comments.parentId IS NOT NULL
        `;

        const [rows] = await connection.query(qGetComment, [commentId, senderId]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};

export const addReplyCommentHandle = async (data : Pick<CommentType, 'parentId' | 'senderId' | 'senderName' | 'receiverId' | 'commentText'>) => {
    try {
        const { parentId, senderId, senderName, receiverId, commentText } = data

        const connection = await pool.getConnection();

        const qAddComment = `
            INSERT INTO comments(parentId, senderId, senderName, receiverId, commentText)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [rows] = await connection.query(qAddComment, [parentId, senderId, senderName, receiverId, commentText]);

        connection.release();

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};

export const getReplyCommentHandle = async (data : CommentType & { page: number }) => {
    try {
        const connection = await pool.getConnection();

        const qGetComment = `
            SELECT comments.*, 
            us_sender.userId as senderId, comments.senderName as senderName, us_sender.username as senderUsername, us_sender.rank as senderRank, 
            us_receiver.userID as receiverId, us_receiver.name as receiverName, us_receiver.username as receiverUsername  
            
            FROM comments

                LEFT JOIN users us_sender ON us_sender.userId = comments.senderId
                LEFT JOIN comments c ON c.commentId = comments.parentId
                LEFT JOIN users us_receiver ON us_receiver.userId = c.senderId

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
            error: error.message,
        };
    }
};
