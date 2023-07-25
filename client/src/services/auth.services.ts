import axios from "axios"; 
import { UserType } from "@/types";
import { removeAccessToken } from "./cookies.servies";
import { apiUrl } from "@/constants";
import { JWT } from "next-auth/jwt";

export const connectUserHandle = async (token : string) => {
    try {
        const connectUser = await axios.get(`${apiUrl}/api/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        return connectUser.data
    } catch (error) {
        // removeAccessToken();
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
}

export const loginUserHandle = async (data: UserType & { accout: string }) => {
    try {
        const userRes = await axios.post(`${apiUrl}/api/auth/login`, data);

        return userRes.data;
    } catch (error) {
        // removeAccessToken();
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
}

export const registerUserHandle = async (data: Pick<UserType, 'name' | 'username' | 'email' | 'password'>) => {
    try {
        const userRes = await axios.post(`${apiUrl}/api/auth/register`, data)

        return userRes.data;
    } catch (error) {
        // removeAccessToken();
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
}

export const connectUserAuthHanlde = async (data: { name: string, email: string, avatar: string | null }) => {
    try {
        const { name, email, avatar }= data;

        const userRes = await axios.post(`${apiUrl}/api/auth/account/verification`, {
            name, email, avatar
        }, {
            // headers: {
            //     Authorization: `Bearer ${token}`
            // }
        })

        return userRes.data;
    } catch (error) {
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
}

export const testHandle = async (token: JWT) => {
    try {
        const connectUser = await axios.get(`${apiUrl}/api/tests/demo`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        return connectUser.data
    } catch (error) {
        // removeAccessToken();
        if(axios.isAxiosError(error) && error.response?.data) {
            return error.response.data;
        } else {
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }
}