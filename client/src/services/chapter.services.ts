import { apiUrl } from "@/constants";
import axios from "axios";

export const getChapterDetailHandle = async (slug: string, chapterNumber: string) => {
    try {
        if(!slug || !chapterNumber) {
            return null;
        }
        const chapter = await axios.get(`${apiUrl}/api/chapters/chapter-detail/${slug}/chapter-${chapterNumber}`);
        if(chapter.data.success) {
            return chapter;
        }
    
        return null;
    } catch (error) {
        // console.log(error)
        return null;
    }
}

export const increaseViewChapterHandle = (params : string) => {
    try {
        if(!params) {
            return;
        }
        axios.post(`${apiUrl}/api/chapters/increase/view/${params}`)

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
}

export const getChaptersNovelByUrlHandle = async (slug: string) => {
    try {
        if(!slug) {
            return null;
        }

        const chapter = await axios.get(`${apiUrl}/api/novels/${slug}/chapters`);
        if(chapter.data.success) {
            return chapter;
        }
    
        return null;
    } catch (error) {
        return null;
    }
}

export const createChapterByUrlHandle = async (slug: string, token: string) => {
    try {
        const chapterRes = await axios.post(`${apiUrl}/api/chapters/create/url/${slug}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        return chapterRes.data
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
}