import { Request, Response } from "express";
import { addBannerHandle, getMultipleBannerHandle, getSingleBannerHandle, updateBlurImageBannersHandle } from "../services/banners.services";
import { BannersType } from "../types";
import { uploadBannersDataHandle } from "../services/image.services";


// Add Banners | /api/add
export const addBanners = async (req: Request, res: Response) => {
    try {

        const { novelId } = req.params
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

        const bannersResponse : any = await addBannerHandle({ novelId, bannersUrl: dataImage.url, bannersPublicId: dataImage.public_id } as BannersType);
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
                bannersId: bannersResponse.insertId,
                bannersUrl: dataImage.url,
                bannersPublicId: dataImage.public_id
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

        const bannersResponse : any = type === 'single' ? await getSingleBannerHandle() : await getMultipleBannerHandle();
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
            banners: bannersResponse.data
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