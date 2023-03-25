import { Request, Response } from "express";
import { createChapterByDataHandle, getChapterDetailHandle, getDataChapterByUrlMTCHandle } from "../services/chapter.services";

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

        const getDataChapter : any = await getDataChapterByUrlMTCHandle({ slug, chapterNumber: Number(chapterNumber) });
        if(!getDataChapter) {
            return res.status(400).json({
                success: false,
                message: "Value invalid"
            })
        }

        const createChapter : any = await createChapterByDataHandle({ novelName: res.locals.novel.title, novelId: res.locals.novel.novelId, ...getDataChapter })
        if(!createChapter) {
            return res.status(400).json({
                success: false,
                message: "Create chapter error"
            })
        }

        return res.json({
            success: true,
            message: "Create novel successful",
            // getDataChapter: { novelName: res.locals.novel.title, novelId: res.locals.novel.novelId, ...getDataChapter }
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

        chapterNumber = chapterNumber.split("chuong-")[1]
        
        const existingChapter : any = await getChapterDetailHandle({ slug, chapterNumber });
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