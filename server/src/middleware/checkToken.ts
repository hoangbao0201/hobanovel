import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.locals.userId = 1;
            next();
            return;
        }

        await jwt.verify(
            token as string,
            process.env.ACCESS_TOKEN_SETCRET as string,
            async (error: any, user : any ) => {
                if (error) {
                    res.locals.user.userId = 1;
                    next();
                    return;
                }

                if(!user.userId) {
                    res.locals.userId = 1;
                    next();
                }

                res.locals.userId = user.userId;
                next();
            }
        );
    } catch (error) {
        next(error);
    }
};
