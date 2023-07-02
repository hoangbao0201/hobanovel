import { apiUrl } from "@/constants";
import { ReviewType } from "@/types";
import axios from "axios";


export const getReviewsByNovelHandle = async (query? : string) => {
    try {
        const reviews = await axios.get(`${apiUrl}/api/reviews/get/${query}`);

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        // console.log(error)
        return null;
    }
};

export const getReviewsByLatestHandle = async (page : string) => {
    try {
        const reviews = await axios.get(`${apiUrl}/api/reviews/search-by-latest/${page}`);

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        // console.log(error)
        return null;
    }
};

export const addReviewsByDataHandle = async (novelId: string, data: ReviewType, token: string) => {
    try {
        const reviews = await axios.post(`${apiUrl}/api/reviews/add/${novelId}`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return reviews.data;
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

export const destroyReviewsByNovelHandle = async (reviewId: string, token: string) => {
    try {
        const reviews = await axios.delete(`${apiUrl}/api/reviews/destroy-review/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        // console.log(error)
        return null;
    }
};

export const destroyReplyReviewsByNovelHandle = async (reviewId: string, token: string) => {
    try {
        const reviews = await axios.delete(`${apiUrl}/api/reviews/destroy-replyreview/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        // console.log(error)
        return null;
    }
};

export const addReplyReviewHandle = async (novelId: string, reviewId: string, data: ReviewType, token: string) => {
    try {
        const reviewsRes = await axios.post(`${apiUrl}/api/reviews/add/reply/${novelId}/${reviewId}`, {
            ...data
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return reviewsRes.data;
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

export const getReplyReviewsHandle = async (reviewId: string) => {
    try {
        const reviews = await axios.get(`${apiUrl}/api/reviews/search-by-review/${reviewId}`);

        if(reviews.data.success) {
            return reviews
        }

        return null;
    } catch (error) {
        // console.log(error)
        return null;
    }
};