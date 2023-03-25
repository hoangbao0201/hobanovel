import { Request, Response } from "express";
import { createNovelByDataHandle, getDataNovelByUrlMTCHandle, getNovelByTitleHandle, getNovelsByPageHandle, getNovelBySlugHandle, getChaptersNovelBySlugHandle, getNovelsByUserIdHandle } from "../services/novel.services";

// Create Novel By Data | /api/novels/create/data
export const createNovelByData = async (req: Request, res: Response) => {
    try {
        const { title, description, author, category, personality, scene, classify, viewFrame } = req.body
        if(!title || !description || !author || !category) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const existingNovel : any = await getNovelByTitleHandle(title as string);
        if(existingNovel?.length) {
            return res.status(400).json({
                success: true,
                message: "novel already exist"
            })
        }

        const data = {
            title, description, author, category, personality, scene, classify, viewFrame
        }
        const createNovel : any = await createNovelByDataHandle(data, res.locals.user.userId);
        if(!createNovel) {
            return res.status(400).json({
                success: false,
                message: "Create novel error"
            })
        }

        return res.json({
            success: true,
            message: "Create novel successful",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Create Novel By Url | /api/novels/take/multiple?page=1
export const createNovelByUrl = async (req: Request, res: Response) => {
    try {
        let { url } : any = req.body
        if(!url) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const dataNovel : any = await getDataNovelByUrlMTCHandle(url as string);
        if(!dataNovel) {
            return res.status(400).json({
                success: false,
                message: "Value invalid"
            })
        }

        const createNovel : any = await createNovelByDataHandle(dataNovel, res.locals.user.userId);
        if(!createNovel) {
            return res.status(400).json({
                success: false,
                message: "Create novel error"
            })
        }

        return res.json({
            success: true,
            message: "Create novel successful",
            novel: {
                slug: dataNovel.slug
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Get Novels By Page | /api/novels/search-by-page/1
export const getNovelsByPage = async (req: Request, res: Response) => {
    try {
        let { page } : any = req.params
        page = page || 1;
        if(isNaN(page)) {
            page = 1
        }
        
        const existingNovels : any = await getNovelsByPageHandle(Number(page));
        if(!existingNovels?.length) {
            return res.status(400).json({
                success: false,
                message: "Get novels error"
            })
        }

        return res.json({
            success: true,
            message: "Get novels successful",
            novels: existingNovels,
            // page: page,
            // isPage: isNaN(page)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Get Novels By Title | /api/novels/search-by-title/1
export const getNovelByTitle = async (req: Request, res: Response) => {
    try {
        let { title } : any = req.params
        if(!title) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }
        
        const existingNovels : any = await getNovelByTitleHandle(String(title));
        if(!existingNovels?.length) {
            return res.status(400).json({
                success: false,
                message: "Get novels error"
            })
        }

        return res.json({
            success: true,
            message: "Get novels successful",
            title: title,
            novels: existingNovels
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Get Novels By Slug | /api/novels/search-by-slug/1
export const getNovelBySlug = async (req: Request, res: Response) => {
    try {
        let { slug } : any = req.params
        if(!slug) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }
        
        const existingNovel : any = await getNovelBySlugHandle(String(slug));
        if(!existingNovel?.length) {
            return res.status(400).json({
                success: false,
                message: "Get novels error"
            })
        }

        return res.json({
            success: true,
            message: "Get novels successful",
            novel: existingNovel[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Get Novels By Slug | /api/novels/:slug/chapters
export const getChaptersNovelBySlug = async (req: Request, res: Response) => {
    try {
        let { slug } : any = req.params
        if(!slug) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }
        
        const existingNovel : any = await getChaptersNovelBySlugHandle(String(slug));
        if(!existingNovel?.length) {
            return res.status(400).json({
                success: false,
                message: "Get chapters novel error"
            })
        }

        return res.json({
            success: true,
            message: "Get chapters novel successful",
            chapters: existingNovel
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Get Novels By Slug | /api/novels/:slug/chapters
export const getNovelsByUserId = async (req: Request, res: Response) => {
    try {
        let { userId } : any = req.params
        if(!userId || userId != res.locals.user.userId) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }
        
        const existingNovel : any = await getNovelsByUserIdHandle(userId);
        if(!existingNovel?.length) {
            return res.status(400).json({
                success: false,
                message: "Get chapters novel error"
            })
        }

        return res.json({
            success: true,
            message: "Get chapters novel successful",
            chapters: existingNovel
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}