import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string
}

export const decryptionToken = async (token: any) => {
    if(!token) {
        return null
    }

    try {
        const result = await jwt.verify(
            token as string,
            process.env.ACCESS_TOKEN_SETCRET as string
        ) as JwtPayload;
    
        return result?.userId || null
    } catch (error) {
        return null
    }
}