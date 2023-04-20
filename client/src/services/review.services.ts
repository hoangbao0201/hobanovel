import { ReviewType } from "@/types";
import axios from "axios";


export const getReviewsByNovelHandle = async (novelId: string) => {
    try {
        const reviews = await axios.get(`http://localhost:4000/api/reviews/search-by-novel/${novelId}`);

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const getReviewsByLatestHandle = async (page : string) => {
    try {
        const reviews = await axios.get(`http://localhost:4000/api/reviews/search-by-latest/${page}`);

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const addReviewsByDataHandle = async (novelId: string, data: ReviewType, token: string) => {
    try {
        const reviews = await axios.post(`http://localhost:4000/api/reviews/add/${novelId}`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};
export const destroyReviewsByNovelHandle = async (reviewId: string, token: string) => {
    try {
        const reviews = await axios.delete(`http://localhost:4000/api/reviews/destroy-review/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const destroyReplyReviewsByNovelHandle = async (reviewId: string, token: string) => {
    try {
        const reviews = await axios.delete(`http://localhost:4000/api/reviews/destroy-replyreview/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const addReplyReviewHandle = async (novelId: string, reviewId: string, data: ReviewType, token: string) => {
    try {
        const reviews = await axios.post(`http://localhost:4000/api/reviews/add-reply-review/${novelId}/${reviewId}`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};

export const getReplyReviewsHandle = async (reviewId: string) => {
    try {
        const reviews = await axios.get(`http://localhost:4000/api/reviews/search-by-review/${reviewId}`);

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        console.log(error)
        return null;
    }
};