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
        console.log(error)
        return null;
    }
}

export const increaseViewChapterHandle = (chapterId : string) => {
    try {
        if(!chapterId) {
            return null
        }
        axios.post(`${apiUrl}/api/chapters/increase/view/${chapterId}`)
    } catch (error) {
        console.log(error)
        return error
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
        if(!slug || !token) {
            return null
        }
    
        const chapter = await axios.post(`${apiUrl}/api/chapters/create-by-url/${slug}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        if(chapter.data.success) {
            return chapter
        }
    
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}