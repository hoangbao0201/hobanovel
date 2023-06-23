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
    readingNovelHandle,
    getReadingNovelHandle,
    followNovelHandle,
    unfollowNovelHandle,
    getAdvancedNovelHandle,
    getFollowsNovelHandle,
    getAllNovelForSeoHandle,
    checkNovelExistedHandle,
    getChapterCountNovelHandle,
} from "../services/novel.services";
import { HistoryReadingType, NovelFollowerType, NovelType } from "../types";
import { uploadThumbnailNovelHandle } from "../services/image.services";


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
        const createNovel = await createNovelByDataHandle(
            data as NovelType,
            res.locals.user.userId
        );
        if (!createNovel.success) {
            return res.status(400).json({
                success: false,
                message: "Create novel error",
                error: createNovel.error
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

        // Check Novel Existed
        const checkNovelExisted = await checkNovelExistedHandle(String(url.split("com/truyen/")[1]))
        if(!checkNovelExisted.success) {
            return {
                success: false,
                error: checkNovelExisted.error
            }
        }

        const novel = checkNovelExisted?.data
        if(novel && novel.length > 0) {
            // Get chapter latest of url
            const chapterNew = await getChapterCountNovelHandle(url);

            return res.json({
                success: true,
                message: "Novel existed",
                novel: {
                    ...checkNovelExisted.data[0],
                    chapterLatest: chapterNew
                }
            })
        }

        // Get Data Novel
        const getDataNovelRes = await getDataNovelByUrlMTCHandle(url as string);
        if (!getDataNovelRes.success) {
            return res.status(400).json({
                success: false,
                error: getDataNovelRes.error
            });
        }

        // Create Novel
        const createNovel: any = await createNovelByDataHandle(
            getDataNovelRes.data,
            res.locals.user.userId
        );
        if (!createNovel.success) {
            return res.status(400).json({
                success: false,
                message: "Create novel error",
                error: createNovel.error
            });
        }

        // Upload Thumbnail Novel
        uploadThumbnailNovelHandle({ slug: String(url.split("com/truyen/")[1]), urlImage: getDataNovelRes.data?.urlImage });

        return res.json({
            success: true,
            message: "Create novel successful",
            novel: {
                novelId: createNovel.data.insertId,
                slug: getDataNovelRes.data.slug,
                chapterCount: 0,
                chapterLatest: getDataNovelRes.data.chapterCount
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

        // const authHeader = req.headers.authorization;
        // let token = authHeader && authHeader.split(" ")[1];
        // // const userId = 1
        // if(!token) {
        //    token = "123123v1"
        // }

        const existingNovel : any = await getNovelBySlugHandle({ slug } as NovelType);
        if (!existingNovel.success) {
            return res.status(400).json({
                success: false,
                message: "Get novels error",
                error: existingNovel.error
            });
        }

        return res.json({
            success: true,
            message: "Get novels successful",
            novel: existingNovel.data[0],
            // token: jwt.verify(token, process.env.ACCESS_TOKEN_SETCRET as string)
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

// reading novel /api/novels/reading/:novelId
export const readingNovel = async (req: Request, res: Response) => {
    try {
        const { novelId, chapterRead } = req.params
        if(!novelId || !chapterRead) {{
            return res.status(400).json({
                success: false,
                message: "Data not found",
            });
        }}
        
        const readingNovelRes : any = await readingNovelHandle({ novelId, userId: res.locals.user.userId, chapterRead } as HistoryReadingType)
        if(!readingNovelRes.success) {
            return res.status(400).json({
                success: false,
                message: "Reading novels Error",
                error: readingNovelRes.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Reading novels successful",
            data: readingNovelRes.data
            // data: { novelId, userId: res.locals.user.userId, chapterRead }
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// get reading novel /api/novels/reading
export const getReadingNovel = async (req: Request, res: Response) => {
    try {
        const { page = 1 } = req.query
        
        const readingNovelRes : any = await getReadingNovelHandle({ userId: res.locals.user.userId, page: page } as HistoryReadingType & { page: number })
        if(!readingNovelRes.success) {
            return res.status(400).json({
                success: false,
                message: "Get reading novels Error",
                error: readingNovelRes.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Get reading novels successful",
            novels: readingNovelRes.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Follow novel /api/novels/get/follows/:novelId
export const getFollowsNovel = async (req: Request, res: Response) => {
    try {
        const { page = 1 } = req.query
        
        const followNovelRes = await getFollowsNovelHandle({ userId: res.locals.user.userId, page } as Pick<NovelFollowerType, 'userId'> & { page: number })
        if(!followNovelRes.success) {
            return res.status(400).json({
                success: false,
                message: "Follow novel Error",
                error: followNovelRes.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Follow novel successful",
            follows: followNovelRes.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Follow novel /api/novels/follow/:novelId
export const followNovel = async (req: Request, res: Response) => {
    try {
        const { novelId } = req.params
        if(!novelId) {
            return res.status(400).json({
                success: false,
                message: "Data not found",
            });
        }
        
        const followNovelRes : any = await followNovelHandle({ userId: res.locals.user.userId, novelId } as NovelFollowerType)
        if(!followNovelRes.success) {
            return res.status(400).json({
                success: false,
                message: "Follow novel Error",
                error: followNovelRes.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Follow novel successful",
            follow: followNovelRes.data.insertId
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}
// Unfollow novel /api/novels/unfollow/:novelId
export const unfollowNovel = async (req: Request, res: Response) => {
    try {
        const { novelId } = req.params
        if(!novelId) {
            return res.status(400).json({
                success: false,
                message: "Data not found",
            });
        }
        
        const unfollowNovelRes : any = await unfollowNovelHandle({ userId: res.locals.user.userId, novelId } as NovelFollowerType)
        if(!unfollowNovelRes.success) {
            return res.status(400).json({
                success: false,
                message: "Unfollow novel Error",
                error: unfollowNovelRes.error,
            })
        }
        
        return res.json({
            success: true,
            message: "Unfollow novel successful",
            follow: unfollowNovelRes.data.insertId
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

export const getAdvancedNovel = async (req: Request, res: Response) => {
    try {
        const data = req.query

        const resultGetNovelRes = await getAdvancedNovelHandle(data);
        if(!resultGetNovelRes.success) {
            return res.status(400).json({
                success: false,
                message: "Get novel error",
                error: resultGetNovelRes.error
            })
        }

        return res.json({
            success: true,
            countPage: Math.ceil(resultGetNovelRes?.countPage[0]?.countPage/20) || 1,
            novels: resultGetNovelRes.data,
            // query: data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

export const getAllNovelForSeo = async (_req: Request, res: Response) => {
    try {

        const resultGetNovelRes = await getAllNovelForSeoHandle();
        if(!resultGetNovelRes.success) {
            return res.status(400).json({
                success: false,
                message: "Get novel error",
                error: resultGetNovelRes.error
            })
        }

        return res.json({
            success: true,
            novels: resultGetNovelRes.data,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}