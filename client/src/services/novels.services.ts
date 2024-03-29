import { HistoryReadingType, NovelFollowerType, NovelType } from "@/types";
import axios from "axios";
import { getAccessToken } from "./cookies.servies";
import { apiUrl } from "@/constants";


export const getNovelsByPageHandle = async (pageNumber: string) => {
    try {
        const chapters = await axios.get(`${apiUrl}/api/novels/search-by-page/${pageNumber}`);

        if(chapters.data.success) {
            return chapters
        }

        return null;
    } catch (error) {
        // console.log(error)
        return null;
    }
};

export const getNovelBySlugHandle = async (slug: string) => {
    try {
        const novelsRes = await axios.get(
            `${apiUrl}/api/novels/search-by-slug/${slug}`, {}
        );
        return novelsRes.data;
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

export const createNovelByUrlHandle = async (url: string, token: string) => {
    try {
        const novelRes = await axios.post(
            `${apiUrl}/api/novels/create/url`,
            {
                url: url,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    
        return novelRes.data;
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

export const getNovelsByDataHandle = async (data: Pick<NovelType, "novelId" | "userId" | "title"> & { page: number }) => {
    try {    
        const novelsRes = await axios.get(
            `${apiUrl}/api/novels/get/${data.novelId || ""}?title=${data.title || ""}&userId=${data.userId || ""}&page=${data.page || "1"}`
        );
    
        return novelsRes.data;
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

export const getNovelsByOutstandingHandle = async (page: number) => {
    try {
    
        const novels = await axios.get(
            `${apiUrl}/api/novels/get/outstanding?page=${page || 1}`
        );
        if (novels.data.success) {
            return novels;
        }
    
        return null;
    } catch (error) {
        // console.log(error)
        return null;
    }
};

export const getNovelsByHighlyRatedHandle = async (page: number) => {
    try {
    
        const novels = await axios.get(
            `${apiUrl}/api/novels/get/highlyrated?page=${page || 1}`
        );
        if (novels.data.success) {
            return novels;
        }
    
        return null;
    } catch (error) {
        // console.log(error)
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
            `${apiUrl}/api/novels/reading/${novelId}/${chapterRead}`, {}, {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            });
        if (readingNovelRes.data.success) {
            return readingNovelRes;
        }
    
        return null;
    } catch (error) {
        // console.log(error)
        return null;
    }
};

export const getReadingNovelHandle = async (page: number, token: string) => {
    try {
        const novelsRes = await axios.get(`${apiUrl}/api/novels/reading?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    
        return novelsRes.data;
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

export const advancedSearchNovelHandle = async (query: string) => {
    try {
        const getNovels = await axios.get(
            `${apiUrl}/api/novels/get/advanced?${query}`);

        return getNovels.data;
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

export const getAllNovelForSeoHandle = async () => {
    try {
        const getNovels = await axios.get(
            `${apiUrl}/api/novels/get/all/seo`);

        return getNovels.data.novels;
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