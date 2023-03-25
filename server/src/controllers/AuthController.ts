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

        const checkUser : any = await getUserByUsernameEmailHandle({ username, email } as UserType)
        if(checkUser?.length) {
            return res.status(400).json({
                success: false,
                message: "User elready exists"
            })
        }

        const createUser : any = await createUserHandle({name, username, email, password} as UserType)
        if(!createUser) {
            return res.status(400).json({
                success: false,
                message: "Create User Error"
            })
        }

        return res.json({
            success: true,
            message: "Create User successful",
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

        const existingUser : any = await getUserByAccoutHandle(accout as string);
        if(!existingUser.length) {
            return res.status(400).json({
                success: false,
                message: "Wrong password or username!"
            })
        }

        // // Verify password
        const verifyPassword = bcrypt.compareSync(password, existingUser[0].password);
        if(!verifyPassword) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Wrong password or username!",
            })
        }

        // // JWT
        const accessToken = await jwt.sign(
            {
                userId: existingUser[0].userId,
            },
            process.env.ACCESS_TOKEN_SETCRET as string
        );

        return res.json({
            success: true,
            message: "Login user successful",
            accessToken: accessToken,
            userId: existingUser[0].userId
        })
        
    } catch (error) {
        return {
            code: 500,
            success: false,
            message: `Internal server error ${error}`,
        };
    }

}
