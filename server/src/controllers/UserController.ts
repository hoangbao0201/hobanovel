import jwt from "jsonwebtoken"
import { Request, Response } from "express";
import { createUserHandle, getUserByAccoutHandle, getUserByIdHandle, getUserByUsernameHandle, updatePasswordUserHandle } from "../services/user.services";
import { UserType } from "../types";


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
        const existingUser : UserType[] | null = await getUserByIdHandle({ userId: id } as UserType)
        if(!existingUser?.length) {
            return res.status(400).json({
                success: false,
                message: "Get users error"
            })
        }

        return res.json({
            success: true,
            message: "Get user successful",
            user: existingUser[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Get User By Id | /api/users/username/:username
export const updatePasswordUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if(!password) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }
        const existingUser = await updatePasswordUserHandle({ userId: res.locals.user.userId, email, password } as UserType)
        if(!existingUser?.success) {
            return res.status(400).json({
                success: false,
                message: "Update password user error",
                error: existingUser.error
            })
        }

        return res.json({
            success: true,
            message: "Update password user successful",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Check Exist User By Accout | /api/users/exist
export const checkExistUserByAccout = async (req: Request, res: Response) => {
    try {
        const { name, username, email, password, avatarUrl } = req.body
        if(!name || !username || !email) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const existingUser = await getUserByAccoutHandle(email);
        let _isExist = !!existingUser.data?.length && !!existingUser.data[0].userId
        let _isPass = !!existingUser.data?.length && !!existingUser?.data[0].password;
        let _id = !!existingUser.data?.length ? existingUser.data[0].userId : null

        if(!_isExist) {
            const createUser : any = await createUserHandle({name, username, email, password, avatarUrl} as UserType)
            if(!createUser.success) {
                return res.status(400).json({
                    success: false,
                    message: "Create User Error",
                    error: createUser.error
                })
            }
            _id = createUser?.data?.insertId;
        }

        // // JWT
        const accessToken = await jwt.sign(
            {
                userId: _id,
            },
            process.env.ACCESS_TOKEN_SETCRET as string
        );

        return res.json({
            success: true,
            message: "Check user successful",
            exist: _isPass,
            token: accessToken
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}
