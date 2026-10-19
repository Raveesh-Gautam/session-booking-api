import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("Missing required environment variable: MONGO_URI");
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri,
  nodeEnv: process.env.NODE_ENV || "development",
};