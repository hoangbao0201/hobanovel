import { Request, Response } from "express";
import { addBannerHandle, getMultipleBannerHandle, getSingleBannerHandle, updateAllBlurImageBannersHandle, updateBlurImageBannersHandle } from "../services/banners.services";
import { BannersType } from "../types";
import { uploadBannersDataHandle } from "../services/image.services";
import { getBlurDataURL } from "../utils/getBlurDataURL";


// Add Banners | /api/add
export const addBanners = async (req: Request, res: Response) => {
    try {

        const { novelId } = req.params
        const { isMobile = 0 } = req.query
        if(!novelId) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const dataImage = await uploadBannersDataHandle(req.file?.path as string);
        if(!dataImage) {
            return res.status(400).json({
                success: false,
                message: "Upload banners Error"
            })
        }

        const hashUrl = await getBlurDataURL(dataImage.url)

        const bannersResponse : any = await addBannerHandle({ novelId, bannersUrl: dataImage.url, imageBlurHash: hashUrl, bannersPublicId: dataImage.public_id, isMobile: isMobile === 0 ? false : true } as BannersType);
        if(!bannersResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Add comments Error",
                error: bannersResponse.error,
            })
        }

        return res.json({
            success: true,
            message: "Create banners successful",
            banners: {
                bannersId: bannersResponse.data.insertId,
                bannersUrl: dataImage.url,
                bannersPublicId: dataImage.public_id,
                imageBlurHash: hashUrl
            } 
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Get Banners | /api/get
export const getBanners = async (req: Request, res: Response) => {
    try {
        const { type = 'single' } = req.params
        const { isMobile = '0' } = req.query
        const checkMobile = isMobile === '0' ? false : true
        const bannersResponse : any = type === 'single' ? await getSingleBannerHandle(checkMobile as boolean) : await getMultipleBannerHandle(checkMobile as boolean);
        if(!bannersResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Get comments Error",
                error: bannersResponse.error,
            })
        }

        return res.json({
            success: true,
            message: "Get banners successful",
            banners: (type === 'single' ? bannersResponse.data[0] : (bannersResponse.data)) || null
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Update Image Blur Banners | /api/update/image/blur/banners/:id
export const updateBlurImageBanners = async (req: Request, res: Response) => {
    try {
        const { imageBlurHash } = req.body
        const { id } = req.params

        const bannersResponse : any = await updateBlurImageBannersHandle({ bannersId: id, imageBlurHash } as BannersType)
        if(!bannersResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Update blur image Error",
                error: bannersResponse.error,
            })
        }

        return res.json({
            success: true,
            message: "Update blur image successful",
            banners: bannersResponse.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Update All Image Blur Banners | /api/update/all/image/blur/banners
export const updateAllBlurImageBanners = async (_req: Request, res: Response) => {
    try {
        const bannersResponse : any = await updateAllBlurImageBannersHandle()
        if(!bannersResponse.success) {
            return res.status(400).json({
                success: false,
                message: "Update all blur image Error",
                error: bannersResponse.error,
            })
        }

        return res.json({
            success: true,
            message: "Update all blur image successful",
            banners: bannersResponse.data
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}