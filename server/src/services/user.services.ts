import bcrypt from "bcryptjs";
import pool from "../library/connectMySQL";


export const getUserByUsernameEmailHandle = async ({ username, email }: any) => {
    try {
        const connection = await pool.getConnection();

        const qGetUser = `
            SELECT userId FROM USERS
            WHERE username = ? OR email = ?
        `;
        const [rows] = await connection.query(qGetUser, [username, email]);

        connection.release();

        return rows
    } catch (error) {
        return null
    }
};

export const createUserHandle = async ({ name, username, email, password }: any) => {
    try {
        const connection = await pool.getConnection();

        // Hash password
        const hashPassword = bcrypt.hashSync(password, 10);
        const valuesCreateUser = [name, username, email, hashPassword];

        const qCreateUser = `
            INSERT INTO USERS(name, username, email, password)
            VALUES (?)
        `
        const [rows] = await connection.query(qCreateUser, [valuesCreateUser]);

        connection.release();

        return rows
    } catch (error) {
        return null
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

        return rows
    } catch (error) {
        return null
    }
}

export const getUserByUsernameHandle = async (username : string) => {
    try {
        const connection = await pool.getConnection();

        const qGetUser = `
            SELECT userId, username, email, description, createAt FROM USERS
            WHERE username = ?
        `

        const [rows] = await connection.query(qGetUser, [username]);

        connection.release();

        return rows
    } catch (error) {
        return null
    }
}

export const getUserByIdHandle = async (userId : number) => {
    try {
        const connection = await pool.getConnection();

        const qGetUser = `
            SELECT userId, name, username, email, description, createdAt FROM USERS 
            WHERE userId = ?
        `

        const [rows] = await connection.query(qGetUser, [userId]);

        connection.release();

        return rows
    } catch (error) {
        return null
    }

}

