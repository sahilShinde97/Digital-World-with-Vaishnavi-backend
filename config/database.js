import mongoose from "mongoose";
import { config } from "dotenv";

config();

if (!process.env.DB) {
  console.error("Database URI is missing. Please check your .env file");
  process.exit(1);
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}; 