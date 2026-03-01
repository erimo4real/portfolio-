import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { bootstrapAdmin } from "../modules/auth/service.js";

dotenv.config();

async function run() {
  try {
    await connectDb();
    const identifier = process.argv[2] || "admin@example.com";
    const password = process.argv[3] || "admin123";
    
    console.log(`Creating admin with identifier: ${identifier}`);
    await bootstrapAdmin(identifier, password);
    console.log("Admin user ensured.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
}

run();
