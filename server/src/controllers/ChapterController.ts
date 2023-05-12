import { Request, Response } from "express";
import { createChapterByDataHandle, getChapterBasicHandle, getChapterDetailHandle, getDataChapterByUrlMTCHandle } from "../services/chapter.services";
import { ChapterType } from "../types";

// Create Novel By Data | /create-by-url/:slug/:chapterNumber
export const createChapterByUrl = async (req: Request, res: Response) => {
    try {
        const { slug, chapterNumber } = req.params
        if(!slug || !chapterNumber) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const getDataChapter : any | null = await getDataChapterByUrlMTCHandle({ novelSlug: slug, chapterNumber: Number(chapterNumber)} as ChapterType);
        if(!getDataChapter.success) {
            return res.status(400).json({
                success: false,
                error: getDataChapter.error
            })
        }

        // // createChapterByDataHandle({ novelName: res.locals.novel.title, novelId: res.locals.novel.novelId, ...getDataChapter });
        const createChapterResponse = await createChapterByDataHandle({ novelSlug: slug, novelName: res.locals.novel.title, novelId: res.locals.novel.novelId, ...getDataChapter.data });
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
            data: { novelName: res.locals.novel.title, novelId: res.locals.novel.novelId, ...getDataChapter }
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
        
        const existingChapter : ChapterType[] | null = await getChapterDetailHandle({ novelSlug: slug, chapterNumber } as ChapterType);
        if(!existingChapter?.length) {
            return res.status(400).json({
                success: false,
                message: "Get chapters novel error"
            })
        }

        return res.json({
            success: true,
            message: "Get chapters novel successful",
            chapter: existingChapter[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}
// Increase View Chapter | /api/chapters/increaseViewChapter/:slug/:chapterNumber
export const increaseViewChapter = async (req: Request, res: Response) => {
    try {
        let { slug, chapterNumber } : any = req.params
        if(!slug || !chapterNumber) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        chapterNumber = chapterNumber.split("chapter-")[1]
        
        const existingChapter : ChapterType[] | null = await getChapterBasicHandle({ novelSlug: slug, chapterNumber } as ChapterType);
        if(!existingChapter?.length) {
            return res.status(400).json({
                success: false,
                message: "Get chapters novel error"
            })
        }

        // const increaseViewChapter : any = await increaseViewChapterHandle({ slug, chapterNumber, view: 8 })

        return res.json({
            success: true,
            message: "Get chapters novel successful",
            // chapter: existingChapter[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}