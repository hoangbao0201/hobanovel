import { HistoryReadingType, NovelFollowerType, NovelType } from "@/types";
import axios from "axios";
import { getAccessToken } from "./cookies.servies";


export const getNovelsByPageHandle = async (pageNumber: string) => {
    try {
        const chapters = await axios.get(`http://localhost:4000/api/novels/search-by-page/${pageNumber}`);

        if(chapters.data.success) {
            return chapters
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const getNovelBySlugHandle = async (slug: string) => {
    try {
        if (!slug) {
            return null;
        }
    
        const novels = await axios.get(
            `http://localhost:4000/api/novels/search-by-slug/${slug}`, {
                // headers: {
                //     Authorization: `Bearer ${token}`,
                // },
            }
        );
        if (novels.data.success) {
            return novels;
        }
    
        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const createNovelByUrlHandle = async (url: string, token: string) => {
    try {
        if (!url) {
            return null;
        }
    
        const novel = await axios.post(
            "http://localhost:4000/api/novels/create/url",
            {
                url: url,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    
        if (novel.data.success) {
            return novel;
        }
    
        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const getNovelsByDataHandle = async (data: Pick<NovelType, "novelId" | "userId" | "title"> & { page: number }) => {
    try {
        const { novelId = '', title = '', userId = '', page = 1 } = data;
    
        const novels = await axios.get(
            `http://localhost:4000/api/novels/get/${novelId}?title=${title}&userId=${userId}&page=${page}`
        );
        if (novels.data.success) {
            return novels;
        }
    
        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const getNovelsByOutstandingHandle = async (page: number) => {
    try {
    
        const novels = await axios.get(
            `http://localhost:4000/api/novels/get/outstanding?page=${page || 1}`
        );
        if (novels.data.success) {
            return novels;
        }
    
        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const getNovelsByHighlyRatedHandle = async (page: number) => {
    try {
    
        const novels = await axios.get(
            `http://localhost:4000/api/novels/get/highlyrated?page=${page || 1}`
        );
        if (novels.data.success) {
            return novels;
        }
    
        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};
export const readingNovelHandle = async (data: Pick<HistoryReadingType, 'novelId' | 'chapterRead'> & { token: string }) => {
    try {
        const { novelId, chapterRead } = data
        if(!novelId || !chapterRead) {
            return null
        }

        const readingNovelRes = await axios.post(
            `http://localhost:4000/api/novels/reading/${novelId}/${chapterRead}`, {}, {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            });
        if (readingNovelRes.data.success) {
            return readingNovelRes;
        }
    
        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const getReadingNovelHandle = async (page: number) => {
    try {
        const token = getAccessToken();

        if(!token) {
            return null
        }

        const readingNovelRes = await axios.post(
            `http://localhost:4000/api/novels/reading?page=${page || 1}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if (readingNovelRes.data.success) {
            return readingNovelRes;
        }
    
        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const followNovelHandle = async (data : Pick<NovelFollowerType, 'novelId'> & { token: string }) => {
    try {
        const { novelId, token } = data
        const followNovelRes = await axios.post(
            `http://localhost:4000/api/novels/follow/${novelId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if (followNovelRes.data.success) {
            // throw new Error()
            return null;
        }
    
        return followNovelRes;
    } catch (error) {
        console.log(error)
        return null;
    }
};
export const unfollowNovelHandle = async (data : Pick<NovelFollowerType, 'novelId'> & { token: string }) => {
    try {
        const { novelId, token } = data
        const followNovelRes = await axios.post(
            `http://localhost:4000/api/novels/unfollow/${novelId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        return followNovelRes.data;
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