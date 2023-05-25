import { ReviewType } from "@/types";
import axios from "axios";


export const getReviewsByNovelHandle = async (data: ReviewType & { page?: number }) => {
    try {
        const { page = 1 } = data
        const reviews = await axios.get(`http://localhost:4000/api/reviews/get/${data?.novelId ?? ''}?page=${page}`);

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
        const reviews = await axios.post(`http://localhost:4000/api/reviews/add/reply/${novelId}/${reviewId}`, {
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