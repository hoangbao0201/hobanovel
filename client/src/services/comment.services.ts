import { apiUrl } from "@/constants";
import axios from "axios";


export const getCommentsHandle = async (novelId?: string, chapterId?: string, page?: number) => {
    try {
        const commentsRes = await axios.get(`${apiUrl}/api/comments/get?novelId=${novelId || ''}&chapterId=${chapterId || ''}&page=${page || ''}`);

        return commentsRes.data
    } catch (error) {
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
};

export const addCommentHandle = async (data : { receiverId?: string, novelId?: string, chapterId?: string, commentText: string, token: string, senderName: string }) => {
    try {
        const { receiverId = '', novelId = '', chapterId = '', commentText, senderName } = data
        const commentsRes = await axios.post(`${apiUrl}/api/comments/add`, {
            receiverId: receiverId,
            novelId: novelId,
            chapterId: chapterId,
            senderName: senderName,
            commentText: commentText,
        }, {
            headers: {
                Authorization: `Bearer ${data.token}`
            }
        });

        return commentsRes.data
    } catch (error) {
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
};

export const addReplyCommentHandle = async (data: { parentId: string, senderName: string, receiverId: string, commentText: string, token: string }) => {
    try {
        const { parentId, senderName, receiverId, commentText, token } = data

        const commentResponse = await axios.post(`${apiUrl}/api/comments/add/reply`, {
            parentId,
            senderName,
            receiverId,
            commentText
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return commentResponse.data;
    } catch (error) {
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
};

export const getReplyCommentsHandle = async (commentId: string, page: number) => {
    try {
        const commentsRes = await axios.get(`${apiUrl}/api/comments/get/reply/${commentId}?page=${page}`);

        return commentsRes.data
    } catch (error) {
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
};

export const destroyCommentHandle = async (commentId: string, token: string) => {
    try {

        const commentRes = await axios.delete(`${apiUrl}/api/comments/destroy/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return commentRes.data
    } catch (error) {
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
};

export const destroyReplyCommentHandle = async (commentId: string, token: string) => {
    try {
        const commentRes = await axios.delete(`${apiUrl}/api/comments/destroy/reply/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return commentRes.data
    } catch (error) {
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
};

