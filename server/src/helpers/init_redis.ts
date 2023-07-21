import Redis from "ioredis";

const redisConnect = new Redis(process.env.REDIS_URI as string);

export default redisConnect;