import { apiUrl } from "@/constants";
import axios from "axios";


export const getCommentsHandle = async (novelId?: string, chapterId?: string, chapterNumber?: number, page?: number) => {
    try {
        const commentsRes = await axios.get(`${apiUrl}/api/comments/get?novelId=${novelId || ''}&chapterId=${chapterId || ''}&chapterNumber=${chapterNumber || ''}&page=${page || ''}`);

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

export const addCommentHandle = async (data : { receiverId?: string, novelId: string, chapterId?: string, chapterNumber?: number, commentText: string, token: string, senderName: string }) => {
    try {
        const { receiverId = '', novelId, chapterId = '', chapterNumber = '', commentText, senderName } = data
        const commentsRes = await axios.post(`${apiUrl}/api/comments/add`, {
            receiverId: receiverId,
            novelId: novelId,
            chapterId: chapterId,
            chapterNumber: chapterNumber,
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

export const addReplyCommentHandle = async (data: { parentId: string, novelId: string, senderName: string, receiverId: string, commentText: string, token: string }) => {
    try {
        const { parentId, novelId, senderName, receiverId, commentText, token } = data

        const commentResponse = await axios.post(`${apiUrl}/api/comments/add/reply`, {
            parentId,
            novelId,
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

export const getCommentsNotifyHandle = async (receiverId: string, page: number, token: string) => {
    try {
        const commentsRes = await axios.get(`${apiUrl}/api/comments/get/notify?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`
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