import { Request, Response } from "express";
import { NovelType, ReviewType } from "../types";
import { addReviewByNovelHandle, destroyReviewByNovelHandle, getReviewByLatestHandle, getReviewByNovelHandle } from "../services/review.services";

// Register User | /api/auth/register
export const addReviewByDataNovel = async (req: Request, res: Response) => {
    try {

        const { pointStoryline, pointPersonality, pointScene, pointTranslation, commentText, isSpoiler } = req.body
        const { novelId } = req.params;
        if(!novelId || !commentText) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const mediumScore = (Number(pointPersonality) + Number(pointScene) + Number(pointStoryline) + Number(pointTranslation))/4

        const reviewResult : any = await addReviewByNovelHandle({ novelId, userId: res.locals.user.userId, dataFeelback: { mediumScore, ...req.body } } as NovelType & { dataFeelback: ReviewType })
        if(!reviewResult.success) {
            return res.status(400).json({
                success: false,
                message: "Create review Error",
                error: reviewResult.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Create review successful",
            demo: reviewResult,
            reviews: {
                reviewId: reviewResult?.data?.insertId || null,
                mediumScore,
                pointStoryline,
                pointPersonality,
                pointScene,
                pointTranslation,
                commentText,
                isSpoiler,
                novelId,
                userId: res.locals.user.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

export const getReviewByNovel = async (req: Request, res: Response) => {
    try {

        const { novelId } = req.params;
        const { page = 1 } = req.query
        if(!novelId || isNaN(Number(page))) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const reviewResult = await getReviewByNovelHandle({ novelId: novelId, page: Number(page)} as NovelType & { page: any })
        if(!reviewResult.success) {
            return res.status(400).json({
                success: false,
                message: "Get reviews Error",
                error: reviewResult.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Get reviews successful",
            reviews: reviewResult.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}
export const getReviewByLatest = async (req: Request, res: Response) => {
    try {
        const { page = 1 } = req.params

        if(isNaN(Number(page))) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const reviewsResponse = await getReviewByLatestHandle(Number(page))
        if(!reviewsResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Get reviews Error",
                error: reviewsResponse.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Get reviews successful",
            reviews: reviewsResponse.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

export const destroyReviewByNovel = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params

        if(!reviewId) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const reviewsResponse = await destroyReviewByNovelHandle({ reviewId, userId: res.locals.user.userId } as ReviewType)
        if(!reviewsResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Get reviews Error",
                error: reviewsResponse.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Delete reviews successful",
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}
