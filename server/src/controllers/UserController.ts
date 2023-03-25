import { Request, Response } from "express";
import { getUserByIdHandle, getUserByUsernameHandle } from "../services/user.services";

// Connect User | /api/users
export const connectUser = async (_req: Request, res: Response) => {
    try {
        return res.json({
            success: true,
            user: res.locals.user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Get User By Id | /api/users/id/:id
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if(!id) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }
        const existingUser : any = await getUserByIdHandle(Number(id))
        if(!existingUser?.length) {
            return res.status(400).json({
                success: false,
                message: "Get users error"
            })
        }

        return res.json({
            success: true,
            message: "Get user successful",
            user: existingUser?.user[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Get User By Id | /api/users/username/:username
export const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.params
        if(!username) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }
        const existingUser : any = await getUserByUsernameHandle(username as string)
        if(!existingUser?.length) {
            return res.status(400).json({
                success: false,
                message: "Get users error"
            })
        }

        return res.json({
            success: true,
            message: "Get user successful",
            user: existingUser?.user[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

