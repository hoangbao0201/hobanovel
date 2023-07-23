import { Request, Response } from "express";


// /api/tests/demo
export const testDemo = async (_req: Request, res: Response) => {
    try {  

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

