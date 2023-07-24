import pool from "../library/connectMySQL";
import { CommentSearchConditions } from "../middleware/conditionsQuery";

import { CommentType } from "../types";

export const addCommentByNovelHandle = async (data: CommentType ) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const { into, values } = CommentSearchConditions(data);

        const qGetUser = `
            INSERT INTO comments(${values})
            VALUES (?);
        `;

        const [rows] = await connection.query(qGetUser, [into]);

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    } finally {
        if (connection) connection.release();
    }
};

export const getCommentsHandle = async (data : Partial<CommentType> & { page: number }) => {
    let connection;
    try {
        const { conditions, params } = CommentSearchConditions(data);
        
        connection = await pool.getConnection();

        // Get countPage
        const qGetCountPage = `
            SELECT COUNT(*) as countPage FROM comments
            WHERE ${conditions}
        `
        const [rowsGetCountPage] : any = await connection.query(qGetCountPage, [...params]);
        
        // Get comments
        const qGetComment = `
            SELECT comments.*, 
            us_sender.userId as senderId, comments.senderName as senderName, us_sender.username as senderUsername, us_sender.avatarUrl, us_sender.rank as senderRank, 
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

        return {
            success: true,
            data: rows,
            countPage: rowsGetCountPage,
            query: qGetComment
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    } finally {
        if (connection) connection.release();
    }
};

export const destroyCommentByNovelHandle = async ({ commentId, senderId } : CommentType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetReview = `
            DELETE FROM comments
            WHERE comments.commentId = ? ${ senderId == "1" ? "" : "AND comments.senderId = ?" } AND comments.parentId IS NULL
        `;

        const [rows] = await connection.query(qGetReview, [commentId, senderId]);

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    } finally {
        if (connection) connection.release();
    }
};

export const destroyReplyCommentByNovelHandle = async ({ commentId, senderId } : CommentType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetComment = `
            DELETE FROM comments
            WHERE comments.commentId = ? ${ senderId == "1" ? "" : "AND comments.senderId = ?" } AND comments.parentId IS NOT NULL
        `;

        const [rows] = await connection.query(qGetComment, [commentId, senderId]);

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    } finally {
        if (connection) connection.release();
    }
};

export const addReplyCommentHandle = async (data : Pick<CommentType, 'parentId' | 'novelId' | 'senderId' | 'senderName' | 'receiverId' | 'commentText'>) => {
    let connection;
    try {
        const { parentId, novelId, senderId, senderName, receiverId, commentText } = data

        connection = await pool.getConnection();

        const qAddComment = `
            INSERT INTO comments(parentId, novelId, senderId, senderName, receiverId, commentText)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [rows] = await connection.query(qAddComment, [parentId, novelId, senderId, senderName, receiverId, commentText]);

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    } finally {
        if (connection) connection.release();
    }
};

export const getReplyCommentHandle = async (data : CommentType & { page: number }) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetComment = `
            SELECT comments.*, 
            us_sender.userId as senderId, comments.senderName as senderName, us_sender.username as senderUsername, us_sender.avatarUrl, us_sender.rank as senderRank, 
            us_receiver.userID as receiverId, us_receiver.name as receiverName, us_receiver.username as receiverUsername  
            
            FROM comments

                LEFT JOIN users us_sender ON us_sender.userId = comments.senderId
                LEFT JOIN comments c ON c.commentId = comments.parentId
                LEFT JOIN users us_receiver ON us_receiver.userId = c.senderId

            WHERE comments.parentId = ? 
            ORDER BY comments.createdAt ASC
            LIMIT 10 OFFSET ?
        `;

        const [rows] = await connection.query(qGetComment, [data.commentId, (Number(data.page) - 1) * 10]);

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    } finally {
        if (connection) connection.release();
    }
};

export const getCommentNotifyHandle = async (receiverId: string, page: number) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetComment = `
            SELECT comments.parentId, comments.commentId, comments.senderName, comments.isRead, comments.createdAt, novels.title, novels.slug FROM comments
                LEFT JOIN novels ON novels.novelId = comments.novelId
            WHERE comments.receiverId = ? AND comments.senderId != ?
            ORDER BY comments.createdAt DESC
            LIMIT 8 OFFSET ?
        `;

        const [rows] = await connection.query(qGetComment, [receiverId, receiverId, (Number(page) - 1) * 8]);

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    } finally {
        if (connection) connection.release();
    }
};

export const addReadCommentNotifyHandle = async (commentId: string, receiverId: string) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qReadComment = `
            UPDATE comments
            SET comments.isRead = 1
            WHERE comments.commentId = ? AND comments.receiverId = ? AND comments.isRead = 0
        `;

        const [rows] = await connection.query(qReadComment, [commentId, receiverId]);

        return {
            success: true,
            data: rows as CommentType[],
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    } finally {
        if (connection) connection.release();
    }
};


