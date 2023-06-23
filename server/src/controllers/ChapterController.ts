import { Request, Response } from "express";
import { createChapterByDataHandle, getChapterDetailHandle, getDataChapterByUrlMTCHandle, increaseViewChapterHandle } from "../services/chapter.services";
import { ChapterType, ChapterViewersType } from "../types";

// Create Novel By Data | /create/url/:slug/:chapterNumber
export const createChapterByUrl = async (req: Request, res: Response) => {
    try {
        const { slug, chapterNumber } = req.params
        if(!slug || !chapterNumber) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        // Get Data Chapter
        const getDataChapter : any | null = await getDataChapterByUrlMTCHandle({ novelSlug: slug, chapterNumber: Number(chapterNumber)} as ChapterType);
        if(!getDataChapter.success) {
            return res.status(400).json({
                success: false,
                error: getDataChapter.error
            })
        }

        // Create Chapter
        const createChapterResponse = await createChapterByDataHandle({ userId: res.locals.user.userId, novelSlug: slug, novelName: res.locals.novel.title, novelId: res.locals.novel.novelId, ...getDataChapter.data });
        if(!createChapterResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Create chapter error",
                error: createChapterResponse.error
            })
        }

        return res.json({
            success: true,
            message: "Create novel successful",
            data: { novelName: res.locals.novel.title, novelId: res.locals.novel.novelId }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Get Chapter Detail | /api/chapters/chapter-detail/:slug/:chapterNumber
export const getChapterDetailBySlug = async (req: Request, res: Response) => {
    try {
        let { slug, chapterNumber } : any = req.params
        if(!slug || !chapterNumber) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        chapterNumber = chapterNumber.split("chapter-")[1]
        
        // let valuesChapter = 
        // if(res.locals?.user) {
        //     valuesChapter = {
        //         ...valuesChapter,
        //         userId: res.locals.user.userId
        //     }
        // }
        const existingChapter : any = await getChapterDetailHandle({ userId: res.locals?.user?.userId || null, novelSlug: slug, chapterNumber } as ChapterType);
        if(!existingChapter?.success) {
            return res.status(400).json({
                success: false,
                message: "Get chapters novel error"
            })
        }

        return res.json({
            success: true,
            message: "Get chapters novel successful",
            chapter: existingChapter.data[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}
// Increase View Chapter | /api/chapters/increase/view/:chapterId
export const increaseViewChapter = async (req: Request, res: Response) => {
    try {
        const { chapterId } : any = req.params
        const { userId } : any = req.query
        if(!chapterId) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }
        
        const existingChapter = await increaseViewChapterHandle({ userId, chapterId } as ChapterViewersType);
        if(!existingChapter.success) {
            return res.status(400).json({
                success: false,
                message: "Increase view novel error",
                error: existingChapter.error
            })
        }

        return res.json({
            success: true,
            message: "Increase view novel successful",
            data: existingChapter
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}