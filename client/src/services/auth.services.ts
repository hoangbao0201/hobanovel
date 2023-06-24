import axios from "axios"; 
import { UserType } from "@/types";
import { removeAccessToken } from "./cookies.servies";
import { apiUrl } from "@/constants";

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

export const registerUserHandle = async (data: UserType) => {
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