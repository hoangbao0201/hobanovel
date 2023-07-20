import { Request, Response } from "express";

// import { setRedis, ttlRedis } from "../models/limiter";


// /api/tests/demo
export const testDemo = async (_req: Request, res: Response) => {
    try {
        
        // const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) as string;

        // const times = await ttlRedis(ip);
        // if(times >= 0) {
        //     return res.status(429).json({
        //         success: false,
        //         message: `Bạn bình luận quá nhanh. Vui lòng đợi ${times} giây nữa để bình luận tiếp.`
        //     })
        // }
        // await setRedis(ip, 1);

        return res.json({
            success: true,
            message: "Test successful",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

