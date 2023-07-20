import redisConnect from "../helpers/init_redis";


export const setRedis = (key: string, value: string | number, time: number) => {

    const redisClient = redisConnect();
    
    return new Promise( (resolve, reject) => {
        redisClient.set( key, value, "EX", time, (err, result) => {
            if(err) return reject(err)

            resolve(result)
        } )
    })
}

export const getRedis = (key: string) => {

    const redisClient = redisConnect();
    
    return new Promise( (resolve, reject) => {
        redisClient.get( key, (err, result) => {
            if(err) return reject(err)

            resolve(result)
        } )
    })
}

export const incrRedis = (key: string) => {

    const redisClient = redisConnect();
    
    return new Promise( (resolve, reject) => {
        redisClient.incr( key, (err, result) => {
            if(err) return reject(err)

            resolve(result)
        } )
    })
}

export const ttlRedis = (key: string) : Promise<number> => {

    const redisClient = redisConnect();
    
    return new Promise( (resolve, reject) => {
        redisClient.ttl( key, (err, result) => {
            if(err || !result) return reject(err)

            resolve(result)
        } )
    })
}

export const expireRedis = (key: string, ttl: number) => {

    const redisClient = redisConnect();
    
    return new Promise( (resolve, reject) => {
        redisClient.expire( key, ttl, (err, result) => {
            if(err) return reject(err)

            resolve(result)
        } )
    })
}

export const delRedis = (key: string) => {

    const redisClient = redisConnect();
    
    return new Promise( (resolve, reject) => {
        redisClient.del( key, (err, result) => {
            if(err) return reject(err)

            resolve(result)
        } )
    })
}

// export default { incr, ttl, expire };