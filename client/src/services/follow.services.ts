import { apiUrl } from "@/constants";
import { NovelFollowerType } from "@/types";
import axios from "axios"

export const checkFollowNovelHandle = async (query : string) => {
    try {
        const checkFollowNovelRes = await axios.get(`${apiUrl}/api/follows/check/${query}`);
        
        return checkFollowNovelRes.data
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

export const getFollowNovelHandle = async (page = 1, token : string) => {
    try {
        const getFollowsNovelRes = await axios.get(
            `${apiUrl}/api/follows/get?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
        return getFollowsNovelRes.data;
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

export const followNovelHandle = async (data : Pick<NovelFollowerType, 'novelId'> & { token: string }) => {
    try {
        const { novelId, token } = data
        const followNovelRes = await axios.post(
            `${apiUrl}/api/follows/add/${novelId}`, {}, {
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
export const unfollowNovelHandle = async (data : Pick<NovelFollowerType, 'novelId'> & { token: string }) => {
    try {
        const { novelId, token } = data
        const followNovelRes = await axios.delete(
            `${apiUrl}/api/follows/delete/${novelId}`, {
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
