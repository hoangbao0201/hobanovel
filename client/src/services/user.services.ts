import axios from "axios";
import { apiUrl } from "@/constants";

export const checkExistUserByAccoutHandle = async (data : { name?: string, username?: string, email?: string, avatarUrl?: string}) => {
    try {
        const { } = data;
        const userRes = await axios.post(`${apiUrl}/api/users/exist`, {
            ...data
        })
    
        return userRes.data
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

export const updatePasswordUserHandle = async (data: { email: string, password : string, token : string }) => {
    try {
        const { email, password, token } = data;
        const userRes = await axios.post(`${apiUrl}/api/users/update/password`, {
            email,
            password
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    
        return userRes.data
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