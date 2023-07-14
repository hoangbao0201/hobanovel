import bcrypt from "bcryptjs";
import pool from "../library/connectMySQL";
import { UserType } from "../types";


export const getUserByUsernameEmailHandle = async ({ username, email }: UserType) => {
    try {
        const connection = await pool.getConnection();

        const qGetUser = `
            SELECT userId FROM USERS
            WHERE username = ? OR email = ?
        `;
        const [rows] = await connection.query(qGetUser, [username, email]);

        connection.release();

        return {
            success: true,
            data: rows as UserType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};

export const createUserHandle = async ({ name, username, email, password, avatarUrl = null }: Pick<UserType, 'name' | 'username' | "email" | 'password' | 'avatarUrl'>) => {
    try {
        const connection = await pool.getConnection();

        // Hash password
        const hashPassword = bcrypt.hashSync(password, 10);
        const valuesCreateUser = [name, username, email, hashPassword, avatarUrl];

        const qCreateUser = `
            INSERT INTO USERS(name, username, email, password, avatarUrl)
            VALUES (?)
        `
        const [rows] = await connection.query(qCreateUser, [valuesCreateUser]);

        connection.release();

        return {
            success: true,
            data: rows as UserType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
};

export const getUserByAccoutHandle = async (accout : string) => {
    try {
        const connection = await pool.getConnection();

        const qGetUser = accout.includes("@")
        ? "SELECT userId, password FROM USERS WHERE email = ?"
        : "SELECT userId, password FROM USERS WHERE username = ?"

        const [rows] = await connection.query(qGetUser, [accout]);

        connection.release();

        return {
            success: true,
            data: rows as UserType[] || []
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
}

export const getUserByUsernameHandle = async ({ username } : UserType) => {
    try {
        const connection = await pool.getConnection();

        const qGetUser = `
            SELECT userId, username, email, rank, description, createAt FROM USERS
            WHERE username = ?
        `

        const [rows] = await connection.query(qGetUser, [username]);

        connection.release();

        return rows as UserType[]
    } catch (error) {
        return null
    }
}

export const getUserByIdHandle = async ({userId} : UserType) => {
    try {
        const connection = await pool.getConnection();

        const qGetUser = `
            SELECT userId, name, username, email, rank, description, avatarUrl, createdAt FROM USERS 
            WHERE userId = ?
        `

        const [rows] = await connection.query(qGetUser, [userId]);

        connection.release();

        return rows as UserType[]
    } catch (error) {
        return null
    }

}

// export const updateUserSignInSocialHanlde = async (data : Partial<UserType>) => {
//     try {

//         const { name, email, avatarUrl } = data

//         const connection = await pool.getConnection();

//         const qCreateUser = `
//             UPDATE USERS
//             set name = ?, 
//             WHERE email = ?
//         `
//         const [rows] = await connection.query(qCreateUser, [name,]);

//         connection.release();

//         return {
//             success: true,
//             data: rows as UserType[]
//         }
//     } catch (error) {
//         return {
//             success: false,
//             error: error.message
//         }
//     }
// }
// export const connectUserBySocialHanlde = async ({ name, email, image } : { name: string, email: string, image: string }) => {
//     try {
//         const connection = await pool.getConnection();

//         // Hash password
//         const hashPassword = bcrypt.hashSync(process.env.ACCESS_TOKEN_SETCRET as string, 10);
//         const valuesCreateUser = [name, email, hashPassword, image];

//         const qCreateUser = `
//             INSERT INTO USERS(name, email, password, avatarUrl)
//             VALUES (?)
//         `
//         const [rows] = await connection.query(qCreateUser, [valuesCreateUser]);

//         connection.release();

//         return {
//             success: true,
//             data: rows as UserType[]
//         }
//     } catch (error) {
//         return {
//             success: false,
//             error: error.message
//         }
//     }
// }
