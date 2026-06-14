const Redis = require("ioredis");

let redisClient = null;

const getRedisClient = () => {
    if (redisClient) return redisClient;

    const redisUrl = process.env.REDIS_URL;

    redisClient = redisUrl
        ? new Redis(redisUrl, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        })
        : new Redis({
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: Number(process.env.REDIS_PORT || 6379),
            password: process.env.REDIS_PASSWORD || undefined,
            db: Number(process.env.REDIS_DB || 0),
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        });

    redisClient.on("connect", () => {
        console.log("Redis connected");
    });

    redisClient.on("error", (error) => {
        console.error("Redis error:", error.message);
    });

    return redisClient;
};

module.exports = getRedisClient;
