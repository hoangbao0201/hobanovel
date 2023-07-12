import axios from "axios"; 
import { BannersType } from "@/types";
import { apiUrl } from "@/constants";

export const addBannersHandle = async (data : Partial<Pick<BannersType, 'novelId' | 'isMobile'>> & { token: string, formData: FormData }) => {
    try {
        const { novelId, isMobile = false, token, formData } = data;

        const uploadBannerResponse = await axios.post(`${apiUrl}/api/banners/add/${novelId}?isMobile=${isMobile ? '1' : '0'}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        return uploadBannerResponse.data;
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
export const getSingleBannersHandle = async () => {
    try {
        const getSingleBannerResponse = await axios.get(`${apiUrl}/api/banners/get/single`)
    
        if(getSingleBannerResponse.data.success) {
            return getSingleBannerResponse
        }
        
        return null;
    } catch (error) {
        return error;
    }
}
export const getMultipleBannersHandle = async (query? : string) => {
    try {
        const getMultipleBannerResponse = await axios.get(`${apiUrl}/api/banners/get/multiple${query}`)
    
        if(getMultipleBannerResponse.data.success) {
            return getMultipleBannerResponse
        }
        
        return null;
    } catch (error) {
        return null;
    }
}