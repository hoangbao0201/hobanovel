import { apiUrl } from "@/constants";
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