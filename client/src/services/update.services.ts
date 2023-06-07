import axios from "axios"; 
import { BannersType, NovelType } from "@/types";
import { apiUrl } from "@/constants";

export const updateBlurImageNovelHandle = async (data : Pick<NovelType, 'novelId' | 'imageBlurHash'> & { token: string }) => {
    const { novelId, imageBlurHash, token } = data
    const updateNovelResponse = await axios.put(`${apiUrl}/api/update/image/blur/novel/${novelId}`, {
        imageBlurHash
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateBlurImageBannersHandle = async (data : BannersType & { token: string }) => {
    const { bannersId, imageBlurHash, token } = data
    const updateBannersResponse = await axios.put(`${apiUrl}/api/update/image/blur/banners/${bannersId}`, {
        imageBlurHash
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}