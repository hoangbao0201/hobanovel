import axios from "axios";

export const getChapterDetailHandle = async (slug: string, chapterNumber: string) => {
    try {
        if(!slug || !chapterNumber) {
            return null;
        }
        const chapter = await axios.get(`http://localhost:4000/api/chapters/chapter-detail/${slug}/chapter-${chapterNumber}`);
        if(chapter.data.success) {
            return chapter;
        }
    
        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const increaseViewChapterHandle = (slug: string, chapterNumber: string) => {
    try {
        if(!slug || !chapterNumber) {
            return null
        }
        axios.get(`http://localhost:4000/api/chapters/increase-view/${slug}/${chapterNumber}`)
    } catch (error) {
        console.log(error)
    }
}

export const getChaptersNovelByUrlHandle = async (slug: string) => {
    try {
        if(!slug) {
            return null;
        }

        const chapter = await axios.get(`http://localhost:4000/api/novels/${slug}/chapters`);
        if(chapter.data.success) {
            return chapter;
        }
    
        return null;
    } catch (error) {
        return null;
    }
}