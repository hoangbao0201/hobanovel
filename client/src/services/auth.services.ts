import axios from "axios"; 
import { UserType } from "@/types";
import { removeAccessToken } from "./cookies.servies";

export const connectUserHandle = async (token : string) => {
    try {
        if(!token) {
            return null;
        }
    
        const connectUser = await axios.get("http://localhost:4000/api/users", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        if(connectUser.data.success) {
            return connectUser
        }
        
        removeAccessToken();
        return null;
    } catch (error) {
        removeAccessToken();
        return null;
    }
}

export const loginUserHandle = async (data: UserType) => {
    try {
        if(!data.accout || !data.password) {
            return null
        }
    
        const user = await axios.post(`http://localhost:4000/api/auth/login`, data);
        if(user.data.success) {
            return user;
        }

        return null;
    } catch (error) {
        console.log(error)
        return null
    }
}

export const registerUserHandle = async (data: UserType) => {
    try {
        if(!data) {
            return null
        }
    
        const user = await axios.post(`http://localhost:4000/api/auth/register`, data)
        if(user.data.success) {
            return user;
        }

        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}