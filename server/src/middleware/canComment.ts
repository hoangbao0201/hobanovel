
import redisConnect from "../helpers/init_redis";


export const canComment = async (userId: string) => {

    try {
        const times = await redisConnect.ttl(`latest:comment:${userId}`);

        if(times >= 0) {
            return {
                success: false,
                message: `Bạn bình luận quá nhanh. Vui lòng đợi ${times} giây nữa để bình luận tiếp!`
            }
        }

        return {
            success: true
        }
    } catch (error) {
        return {
            success: false,
            error: error?.message,
            message: "Server qúa tải, mong bạn thông cảm"
        }
    }
}

export const setComment = async (userId: string) => {

    try {
        await redisConnect.set(`latest:comment:${userId}`, 1, "EX", 15);

        return {
            success: true,
            message: "created successful"
        }
    } catch (error) {
        return {
            success: false,
            error: error?.message,
            message: "Server qúa tải, mong bạn thông cảm"
        }
    }
}