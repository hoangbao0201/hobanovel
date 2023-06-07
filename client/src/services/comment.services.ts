import { apiUrl } from "@/constants";
import { CommentType, ReviewType } from "@/types";
import axios from "axios";


export const getCommentsHandle = async (data: CommentType & { page?: number }) => {
    try {
        const { chapterId = '', page = 1 } = data
        const comments = await axios.get(`${apiUrl}/api/comments/get/${data?.novelId ?? ''}?page=${page}&chapterId=${chapterId}`);

        if(comments.data.success) {
            return comments
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const addCommentHandle = async (data : CommentType & { token: string }) => {
    try {
        const { novelId = '', chapterId = '' } = data
        const comments = await axios.post(`${apiUrl}/api/comments/add/${String(novelId)}?chapterId=${String(chapterId)}`, {
            commentText: data.commentText
        }, {
            headers: {
                Authorization: `Bearer ${data.token}`
            }
        });

        if(comments.data.success) {
            return comments
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const addReplyCommentHandle = async (data : CommentType & { token: string }) => {
    try {
        const { commentId, token, commentText } = data
        const commentResponse = await axios.post(`${apiUrl}/api/comments/add/reply/${commentId}`, {
            commentText: commentText
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(commentResponse.data.success) {
            return commentResponse
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const getReplyCommentsHandle = async (data: CommentType & { page: number }) => {
    try {
        const { commentId = '', page = 1 } = data;

        const commentsResponse = await axios.get(`${apiUrl}/api/comments/get/reply/${commentId}?page=${page ?? ''}`);

        if(commentsResponse.data.success) {
            return commentsResponse;
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const destroyCommentHandle = async (data : CommentType & { token: string }) => {
    try {
        const { commentId, token } = data

        const comments = await axios.delete(`${apiUrl}/api/comments/destroy/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(comments.data.success) {
            return comments
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const destroyReplyCommentHandle = async (data : CommentType & { token: string }) => {
    try {
        const { commentId, token } = data
        const reviews = await axios.delete(`${apiUrl}/api/comments/destroy/reply/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

