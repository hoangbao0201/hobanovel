import axios from "axios"; 
import { BannersType } from "@/types";

export const addBannersHandle = async (data : Partial<Pick<BannersType, 'novelId'>> & { token: string, formData: FormData }) => {
    try {
        const { novelId, token, formData } = data;
        if(!token) {
            return null;
        }
    
        const uploadBannerResponse = await axios.post(`http://localhost:4000/api/banners/add/${novelId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        if(uploadBannerResponse.data.success) {
            return uploadBannerResponse
        }
        
        return null;
    } catch (error) {
        return error;
    }
}
export const getSingleBannersHandle = async () => {
    try {
        const getSingleBannerResponse = await axios.get(`http://localhost:4000/api/banners/get/single`)
    
        if(getSingleBannerResponse.data.success) {
            return getSingleBannerResponse
        }
        
        return null;
    } catch (error) {
        return error;
    }
}
export const getMultipleBannersHandle = async () => {
    try {
        const getMultipleBannerResponse = await axios.get(`http://localhost:4000/api/banners/get/multiple`)
    
        if(getMultipleBannerResponse.data.success) {
            return getMultipleBannerResponse
        }
        
        return null;
    } catch (error) {
        return null;
    }
}