import { Request, Response } from "express";

import { decryptionToken } from "../middleware/decryptionToken";
import { checkFollowNovelHanle } from "../services/follows.services";
import { NovelFollowerType } from "src/types";

// Connect User | /api/follows/
export const checkFollowNovel = async (req: Request, res: Response) => {
    try {

        const { novelId } = req.params
        const { token } = req.query

        const checkToken = await decryptionToken(token);
        if(!checkToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid token or user doesn't exist"
            })
        }

        const checkFollowNovelRes : any = await checkFollowNovelHanle({novelId, userId: checkToken} as NovelFollowerType);
        if(!checkFollowNovelRes.success) {
            return res.status(400).json({
                success: false,
                message: "",
                error: checkFollowNovelRes.error
            })
        }
        return res.json({
            success: true,
            // dataFollow: checkFollowNovelRes,
            // data: {novelId, userId: checkToken}
            isFollow: (checkFollowNovelRes.data.length > 0 ? true : false),
            // user: res.locals.user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}