import Redis from "ioredis";

const redisConnect = () => {
    // const redisClient = new Redis({
    //     // host: "127.0.0.1",
    //     // port: 6379,
    //     host: "redis-16328.c252.ap-southeast-1-1.ec2.cloud.redislabs.com",
    //     port: 16328,
        
    //     retryStrategy: (times) => {
    //         if (times < 10) {
    //             return 5000;
    //         }
    //         return null;
    //     },
    // });

    const redisClient = new Redis(process.env.REDIS_URI as string)

    return redisClient;
};

export default redisConnect;

