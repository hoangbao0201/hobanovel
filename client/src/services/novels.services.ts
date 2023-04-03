import axios from "axios";


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
            `http://localhost:4000/api/novels/search-by-slug/${slug}`
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