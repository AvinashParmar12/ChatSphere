import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "MONGODB_URI",
  "REDIS_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "ACCESS_TOKEN_EXPIRES_IN",
  "REFRESH_TOKEN_EXPIRES_IN",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export const env = {
  PORT: Number(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV as string,
  MONGODB_URI: process.env.MONGODB_URI!,
  REDIS_URL:process.env.REDIS_URL!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN!,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN!,
  // ==============================
  // Cloudinary
  // ==============================
  CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET!,
};