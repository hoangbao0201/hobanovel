import { Request, Response } from "express";
import { createUserHandle } from "../services/user.services";
// import { testDemoHandle } from "../services/test.services";

// // Create Novel By Data | /api/tests/demo
export const testDemo = async (_req: Request, res: Response) => {
    try {
        const users : any = await createUserHandle({ username: "5", email: "5", password: "5" });
        if(!users) {
            return res.status(400).json({
                success: false,
                message: "Get users error"
            })
        }

        return res.json({
            success: true,
            message: "Create novel successful",
            users: users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

