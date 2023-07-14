import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// import { getUserByIdHandle } from "../services/user.services";
// import { UserType } from "../types";

export const verifySignInSocial = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.json({
                code: 400,
                success: false,
                message: "Access token not found",
                error: req.headers.authorization
            });
            return;
        }

        await jwt.verify(
            token as string,
            process.env.ACCESS_TOKEN_SETCRET as string,
            async (error: any, user : any ) => {
                if (error) {
                    res.json({
                        code: 400,
                        success: false,
                        error: "decodes",
                        message: "Invalid token or user doesn't exist 1",
                    });
                    return;
                }
                const { name, email, avatar } = user
                if(!name && !email && !avatar) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid token or user doesn't exist 2"
                    })
                    return;
                }

                res.locals.user = {
                    ...user
                };
                next();
            }
        );
    } catch (error) {
        next(error);
    }
};
