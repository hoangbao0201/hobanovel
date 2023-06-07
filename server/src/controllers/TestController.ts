import { Request, Response } from "express";
import { testDemoHandle } from "../services/test.services";

// // Create Novel By Data | /api/tests/demo
export const testDemo = async (req: Request, res: Response) => {
    try {
        
        const resTest = await testDemoHandle();
        if(!resTest.success) {
            return res.status(500).json({
                success: false,
                error: resTest.error
            });
        }

        return res.json({
            success: true,
            message: "Test successful",
            data: resTest.data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

