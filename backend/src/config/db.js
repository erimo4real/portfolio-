import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/portfolio";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || "portfolio" });
}
