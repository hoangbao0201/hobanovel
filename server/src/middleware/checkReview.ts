import { Request, Response, NextFunction } from "express";
import { checkReviewExistenceHandle } from "../services/review.services";
import { ReviewType } from "src/types";

export const checkReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { novelId } = req.params;
        if(!novelId) {
            res.status(400).json({
                success: false,
                message: "Data not found"
            })
            return
        }
        const checkReview = await checkReviewExistenceHandle({ userId: res.locals.user.userId, novelId: novelId } as ReviewType);
        if(checkReview.data?.length) {
            res.status(400).json({
                success: false,
                message: "Bạn đã đánh giá cuốn sách này rồi, nếu muốn đánh giá lại hãy xóa đánh giá cũ đi"
            })
            return;
        }

        next()
    } catch (error) {
        next(error);
    }
};
