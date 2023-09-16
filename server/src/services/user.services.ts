import bcrypt from "bcryptjs";
import pool from "../library/connectMySQL";
import { UserType } from "../types";


export const getUserByUsernameEmailHandle = async ({ username, email }: UserType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetUser = `
            SELECT userId FROM USERS
            WHERE username = ? OR email = ?
        `;
        const [rows] = await connection.query(qGetUser, [username, email]);

        return {
            success: true,
            data: rows as UserType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
};

export const createUserHandle = async ({ name, username, email, password, avatarUrl = null }: Pick<UserType, 'name' | 'username' | "email" | 'password' | 'avatarUrl'>) => {
    let connection;
    try {
        connection = await pool.getConnection();

        // Hash password
        const hashPassword = password ? bcrypt.hashSync(password, 10) : null;
        const valuesCreateUser = [name, username, email, hashPassword, avatarUrl];

        const qCreateUser = `
            INSERT INTO USERS(name, username, email, password, avatarUrl)
            VALUES (?)
        `
        const [rows] = await connection.query(qCreateUser, [valuesCreateUser]);

        return {
            success: true,
            data: rows as UserType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
};

export const getUserByAccoutHandle = async (accout : string) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetUser = accout.includes("@")
        ? "SELECT userId, password FROM USERS WHERE email = ?"
        : "SELECT userId, password FROM USERS WHERE username = ?"

        const [rows] = await connection.query(qGetUser, [accout]);

        return {
            success: true,
            data: rows as UserType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error
        }
    } finally {
        if (connection) connection.release();
    }
}

export const getUserByUsernameHandle = async ({ username } : UserType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetUser = `
            SELECT userId, username, email, "rank", description, createAt FROM USERS
            WHERE username = ?
        `

        const [rows] = await connection.query(qGetUser, [username]);

        return {
            success: true,
            data: rows as UserType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    } finally {
        if (connection) connection.release();
    }
}

export const updatePasswordUserHandle = async ({ userId, email, password } : UserType) => {
    let connection;
    try {
        // Hash password
        const hashPassword = password ? bcrypt.hashSync(password, 10) : null;
        
        connection = await pool.getConnection();

        const qUpdatePasswordUser = `
            UPDATE users
            SET users.password = ?
            WHERE users.userId = ? AND users.email = ?
        `

        const [rows] = await connection.query(qUpdatePasswordUser, [hashPassword, userId, email]);

        return {
            success: true,
            data: rows as UserType[]
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    } finally {
        if (connection) connection.release();
    }
}

export const getUserByIdHandle = async ({userId} : UserType) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const qGetUser = `
            SELECT userId, name, username, email, "rank", description, avatarUrl, createdAt FROM USERS 
            WHERE userId = ?
        `

        const [rows] = await connection.query(qGetUser, [userId]);

        return rows as UserType[]
    } catch (error) {
        return null
    } finally {
        if (connection) connection.release();
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