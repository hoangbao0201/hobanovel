import Cookies from "js-cookie"

export const getAccessToken = () => {
    return Cookies.get("accessToken")
}

export const getAccessTokenOnServer = (accessToken: string) => {
    const token = accessToken?.split("accessToken=")[1];
    return token || null
}

export const addAccessToken = (token: string) => {
    if(!token) {
        return
    }
    Cookies.set("accessToken", token)
}

export const removeAccessToken = () => {
    Cookies.remove("accessToken")
}