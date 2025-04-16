import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_HOST });

redis.on("error", (err) => console.log("Redis Client Error", err));

await redis.connect();
console.log("Redis conectado!");

export default redis;
