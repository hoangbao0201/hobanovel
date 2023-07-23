import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

import { UserType } from "../types/index";


import { getUserByUsernameEmailHandle, createUserHandle, getUserByAccoutHandle } from "../services/user.services";

// Register User | /api/auth/register
export const registerUser = async (req: Request, res: Response) => {
    try {

        const { name, username, email, password } = req.body
        if(!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const checkUser = await getUserByUsernameEmailHandle({ username, email } as UserType)
        if(!checkUser.success || checkUser.data?.length) {
            return res.status(400).json({
                success: false,
                message: "User elready exists",
                error: checkUser.error
            })
        }

        const createUser = await createUserHandle({name, username, email, password} as UserType)
        if(!createUser.success) {
            return res.status(400).json({
                success: false,
                message: "Create User Error",
                error: createUser.error
            })
        }

        return res.json({
            success: true,
            message: "Create User successful",
            // checkUser
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${error}`,
        });
    }
}

// Login User | /api/auth/Login
export const loginUser = async (req: Request, res: Response) => {

    try {
        const { accout, password } = req.body;
        if(!accout || !password) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        const existingUser = await getUserByAccoutHandle(accout as string);
        if(!existingUser?.success || !existingUser?.data?.length || !existingUser.data[0].password ) {
            return res.status(400).json({
                success: false,
                message: "Wrong password or username!",
            })
        }

        // Verify password
        const verifyPassword = bcrypt.compareSync(password, existingUser.data[0].password);
        if(!verifyPassword) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Wrong password or username!",
            })
        }

        // JWT
        const accessToken = await jwt.sign(
            {
                userId: existingUser.data[0].userId,
            },
            process.env.ACCESS_TOKEN_SETCRET as string
        );

        return res.json({
            success: true,
            message: "Login user successful",
            accessToken: accessToken,   
            userId: existingUser.data[0].userId
        })
        
    } catch (error) {
        return {
            code: 500,
            success: false,
            message: `Internal server error ${error}`,
        };
    }

}

export const checkUser = async (req: Request, res: Response) => {
    try {
        const { name, email, avatar } = req.body;
        if(!name || !email || !avatar) {
            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }


        // Check existingUser
        const existingUser = await getUserByAccoutHandle(email as string);
        if(existingUser?.data?.length) {
            // JWT
            const accessToken = await jwt.sign(
                {
                    userId: existingUser.data[0].userId,
                },
                process.env.ACCESS_TOKEN_SETCRET as string
            );

            return res.json({
                success: true,
                message: "Login user successful",
                accessToken: accessToken,
                user: existingUser.data
            })
        }

        const dataCreate = { 
            name: name,
            username: email.split("@")[0],
            email: email,
            password: "123",
            avatarUrl: avatar
        }
        // Create user
        const createUser = await createUserHandle(dataCreate)
        if(!createUser.success) {
            return res.status(400).json({
                success: false,
                message: "Create User Error",
                error: createUser.error
            })
        }

        const existingUserNew = await getUserByAccoutHandle(email as string);
        if(!existingUserNew.success || !existingUserNew.data?.length) {
            return res.status(400).json({
                success: false,
                message: "tạo xong, nhưng lấy thất bại"
            })
        }

        // JWT
        const accessToken = await jwt.sign(
            {
                userId: existingUserNew.data[0].userId,
            },
            process.env.ACCESS_TOKEN_SETCRET as string
        );

        return res.json({
            success: true,
            message: "Login user successful",
            accessToken: accessToken,
            user: existingUserNew.data
        })
        
    } catch (error) {
        return {
            code: 500,
            success: false,
            message: `Internal server error ${error}`,
        };
    }
}
