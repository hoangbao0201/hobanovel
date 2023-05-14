import { Request, Response } from "express";
import {
    createNovelByDataHandle,
    getDataNovelByUrlMTCHandle,
    getNovelByTitleHandle,
    getNovelsByPageHandle,
    getNovelBySlugHandle,
    getChaptersNovelBySlugHandle,
    getNovelsByUserIdHandle,
    updateBlurImageNovelHandle,
    updateAllBlurImageNovelHandle,
    getNovelsByDataHanle,
    getNovelsByOutstandingHandle,
    getNovelsByHighlyRatedHandle,
} from "../services/novel.services";
import { NovelType } from "../types";

// Create Novel By Data | /api/novels/create/data
export const createNovelByData = async (req: Request, res: Response) => {
    try {
        const {
            title,
            description,
            author,
            category,
            personality,
            scene,
            classify,
            viewFrame,
        } = req.body;
        if (!title || !description || !author || !category) {
            return res.status(400).json({
                success: false,
                message: "Data not found",
            });
        }

        const existingNovel: NovelType[] | null = await getNovelByTitleHandle({
            title,
        } as NovelType);
        if (existingNovel?.length) {
            return res.status(400).json({
                success: true,
                message: "novel already exist",
            });
        }

        const data = {
            title,
            description,
            author,
            category,
            personality,
            scene,
            classify,
            viewFrame,
        };
        const createNovel: NovelType[] | null = await createNovelByDataHandle(
            data as NovelType,
            res.locals.user.userId
        );
        if (!createNovel) {
            return res.status(400).json({
                success: false,
                message: "Create novel error",
            });
        }

        return res.json({
            success: true,
            message: "Create novel successful",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
};

// Create Novel By Url | /api/novels/take/multiple?page=1
export const createNovelByUrl = async (req: Request, res: Response) => {
    try {
        let { url } = req.body;
        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Data not found",
            });
        }

        const dataNovel : any | null = await getDataNovelByUrlMTCHandle(url as string);
        if (!dataNovel) {
            return res.status(400).json({
                success: false,
                message: "Value invalid",
            });
        }

        const createNovel: any = await createNovelByDataHandle(
            dataNovel,
            res.locals.user.userId
        );
        if (!createNovel) {
            return res.status(400).json({
                success: false,
                message: "Create novel error",
            });
        }

        return res.json({
            success: true,
            message: "Create novel successful",
            // dataNovel
            novel: {
                novelId: createNovel.insertId,
                slug: dataNovel.slug,
                chapterNumber: dataNovel.chapterNumber,
                thumbnailUrl: dataNovel.thumbnailUrl
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
};

// Get Novels By Page | /api/novels/search-by-page/1
export const getNovelsByPage = async (req: Request, res: Response) => {
    try {
        let { page } : any = req.params;
        page = page || 1;
        if (isNaN(page)) {
            page = 1;
        }

        const existingNovels: NovelType[] | null = await getNovelsByPageHandle(Number(page));
        if (!existingNovels?.length) {
            return res.status(400).json({
                success: false,
                message: "Get novels error",
            });
        }

        return res.json({
            success: true,
            message: "Get novels successful",
            novels: existingNovels
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
};

// Get Novels By Title | /api/novels/search-by-title/1
export const getNovelByTitle = async (req: Request, res: Response) => {
    try {
        let { title }: any = req.params;
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Data not found",
            });
        }

        const existingNovels: NovelType[] | null = await getNovelByTitleHandle({ title } as NovelType);
        if (!existingNovels?.length) {
            return res.status(400).json({
                success: false,
                message: "Get novels error",
            });
        }

        return res.json({
            success: true,
            message: "Get novels successful",
            title: title,
            novels: existingNovels
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
};

// Get Novels By Slug | /api/novels/search-by-slug/:slug
export const getNovelBySlug = async (req: Request, res: Response) => {
    try {
        let { slug }: any = req.params;
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Data not found",
            });
        }

        const existingNovel: NovelType[] | null = await getNovelBySlugHandle({ slug } as NovelType);
        if (!existingNovel?.length) {
            return res.status(400).json({
                success: false,
                message: "Get novels error",
            });
        }

        return res.json({
            success: true,
            message: "Get novels successful",
            novel: existingNovel[0],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
};

// Get Novels By Slug | /api/novels/:slug/chapters
export const getChaptersNovelBySlug = async (req: Request, res: Response) => {
    try {
        let { slug }: any = req.params;
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Data not found",
            });
        }

        const existingNovel: NovelType[] | null = await getChaptersNovelBySlugHandle({ slug } as NovelType);
        if (!existingNovel?.length) {
            return res.status(400).json({
                success: false,
                message: "Get chapters novel error",
            });
        }

        return res.json({
            success: true,
            message: "Get chapters novel successful",
            chapters: existingNovel
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
};

// Get Novels By Slug | /api/novels/:slug/chapters
export const getNovelsByUserId = async (req: Request, res: Response) => {
    try {
        let { userId }: any = req.params;
        if (!userId || userId != res.locals.user.userId) {
            return res.status(400).json({
                success: false,
                message: "Data not found",
            });
        }

        const existingNovel: NovelType[] | null = await getNovelsByUserIdHandle({ userId } as NovelType);
        if (!existingNovel?.length) {
            return res.status(400).json({
                success: false,
                message: "Get chapters novel error",
            });
        }

        return res.json({
            success: true,
            message: "Get chapters novel successful",
            chapters: existingNovel,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
};

// Get Banner Novels | /api/novels/:slug/chapters
export const getBannerNovel = async (_req: Request, res: Response) => {
    try {
        return res.json({
            success: true,
            message: "Get banner novel successful",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
};

// Update Image Blur Novel | /api/update/image/blur/novel/:id
export const updateBlurImageNovel = async (req: Request, res: Response) => {
    try {
        const { imageBlurHash } = req.body
        const { id } = req.params

        const novelResponse : any = await updateBlurImageNovelHandle({ novelId: id, imageBlurHash } as NovelType)
        if(!novelResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Update blur image Error",
                error: novelResponse.error,
            })
        }

        return res.json({
            success: true,
            message: "Update blur image successful",
            novel: novelResponse.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Update All Image Blur Novel | /api/update/all/image/blur/novel/:id
export const updateAllBlurImageNovel = async (_req: Request, res: Response) => {
    try {
        const novelResponse : any = await updateAllBlurImageNovelHandle();
        if(!novelResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Update all blur image Error",
                error: novelResponse.error,
            })
        }

        return res.json({
            success: true,
            message: "Update all blur image successful",
            novel: novelResponse.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

//Get novels /api/novels/get/:novelId?
export const getNovelsByData = async (req: Request, res: Response) => {
    try {

        const { novelId = '' } = req.params;
        const { page = 1, title = '', userId = '' } = req.query

        const dataNovel = {
            novelId: novelId,
            title: title,
            userId: userId,
            page: Number(page) ?? 1
        }
        const novelsRes : any = await getNovelsByDataHanle(dataNovel as NovelType & { page: number })
        if(!novelsRes.success) {
            return res.status(400).json({
                success: false,
                message: "Get novels Error",
                error: novelsRes.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Get novels successful",
            novels: novelsRes.data,
            // dataNovel
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

//Get novels outstanding /api/novels/get/outstanding
export const getNovelsByOutstanding = async (req: Request, res: Response) => {
    try {
        const { page = 1 } = req.query
        
        const novelsRes : any = await getNovelsByOutstandingHandle(Number(page))
        if(!novelsRes.success) {
            return res.status(400).json({
                success: false,
                message: "Get novels Error",
                error: novelsRes.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Get novels successful 1",
            novels: novelsRes.data,
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

//Get novels highlyrated /api/novels/get/highlyrated
export const getNovelsByHighlyRated = async (req: Request, res: Response) => {
    try {
        const { page = 1 } = req.query
        
        const novelsRes : any = await getNovelsByHighlyRatedHandle(Number(page))
        if(!novelsRes.success) {
            return res.status(400).json({
                success: false,
                message: "Get novels Error",
                error: novelsRes.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Get novels successful 1",
            novels: novelsRes.data,
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}