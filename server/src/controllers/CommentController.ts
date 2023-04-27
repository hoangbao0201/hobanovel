import { Request, Response } from "express";
import { CommentType } from "../types";
import { addReplyCommentHandle, addCommentByNovelHandle, destroyReplyCommentByNovelHandle, destroyCommentByNovelHandle, getReplyCommentHandle, getCommentByNovelHandle } from "../services/comment.services";

// Register User | /api/auth/register
export const addCommentByNovel = async (req: Request, res: Response) => {
    try {

        const { commentText = '' } = req.body;
        const { chapterId = '' } = req.query;
        const { novelId = '' } = req.params;
        if(!commentText) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const dataComment = {
            userId: res.locals.user.userId,
            novelId: String(novelId),
            chapterId: String(chapterId),
            commentText: String(commentText)
        }
        const commentResult : any = await addCommentByNovelHandle(dataComment as CommentType)
        if(!commentResult.success) {
            return res.status(400).json({
                success: false,
                message: "Create comment Error",
                error: commentResult.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Create comment successful",
            data: {
                commentId: commentResult.data.insertId
            }
            // data: commentResult.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

export const getCommentByNovel = async (req: Request, res: Response) => {
    try {

        const { novelId = '' } = req.params;
        const { page = 1, chapterId = '' } = req.query

        const dataComments = {
            novelId: String(novelId),
            chapterId: String(chapterId),
            page: Number(page) ?? 1
        }
        const commentResult : any = await getCommentByNovelHandle(dataComments as CommentType & { page: number });
        if(!commentResult.success) {
            return res.status(400).json({
                success: false,
                message: "Get comments Error",
                error: commentResult.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Get comments successful",
            comments: commentResult.data,
            // dataComments
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

export const destroyCommentByNovel = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params

        if(!commentId) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const commentsResponse = await destroyCommentByNovelHandle({ commentId, userId: res.locals.user.userId } as CommentType)
        if(!commentsResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Delete comments Error",
                error: commentsResponse.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Delete comments successful",
            // commentId: commentId,
            // userId: res.locals.user
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

export const destroyReplyCommentByNovel = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params
        if(!commentId) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const commentsResponse = await destroyReplyCommentByNovelHandle({ commentId, userId: res.locals.user.userId } as CommentType)
        if(!commentsResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Delete reply comment Error",
                error: commentsResponse.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Delete reply reviews successful",
            commentId
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

export const addReplyComment = async (req: Request, res: Response) => {
    try {
        const { commentId = '' } = req.params
        const { commentText = '' } = req.body

        if(!commentText) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const dataComments : Partial<CommentType> = {
            userId: res.locals.user.userId,
            commentId: String(commentId) ??  '',
            commentText: String(commentText) ??  ''
        }
        const commentResponse : any = await addReplyCommentHandle(dataComments as CommentType);
        if(!commentResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Add comments Error",
                error: commentResponse.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Add comments successful",
            data: {
                commentId: commentResponse.data.insertId
            }
            // comment: {
            //     commentId: commentResponse?.data?.insertId || null,
            // }
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

export const getReplyComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params
        const { page = 1 } = req.query

        if(!commentId) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }
        const dataReplyComment = {
            commentId,
            page: Number(page) ?? 1
        }
        const commentResponse = await getReplyCommentHandle(dataReplyComment as CommentType & { page: number });
        if(!commentResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Get comments Error",
                error: commentResponse.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Get comments successful",
            comments: commentResponse.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}
