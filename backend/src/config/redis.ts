import { createClient } from "redis";
import { env } from "./env";

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis Error:", error);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();

    console.log("Redis Connected Successfully");
  } catch (error) {
    console.error("Redis Connection Failed:", error);

    process.exit(1);
  }
};