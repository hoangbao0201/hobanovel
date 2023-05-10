import axios from "axios"; 
import { BannersType, NovelType } from "@/types";

export const updateBlurImageNovelHandle = async (data : Pick<NovelType, 'novelId' | 'imageBlurHash'> & { token: string }) => {
    const { novelId, imageBlurHash, token } = data
    const updateNovelResponse = await axios.put(`http://localhost:4000/api/update/image/blur/novel/${novelId}`, {
        imageBlurHash
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateBlurImageBannersHandle = async (data : BannersType & { token: string }) => {
    const { bannersId, imageBlurHash, token } = data
    const updateBannersResponse = await axios.put(`http://localhost:4000/api/update/image/blur/banners/${bannersId}`, {
        imageBlurHash
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}