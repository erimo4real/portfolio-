import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { bootstrapAdmin } from "../modules/auth/service.js";

dotenv.config();

async function run() {
  try {
    await connectDb();
    const identifier = process.argv[2];
    const password = process.argv[3];
    
    if (!identifier || !password) {
      console.error("Usage: node src/scripts/seed-admin.js <email> <password>");
      process.exit(1);
    }
    
    if (password.length < 8) {
      console.error("Password must be at least 8 characters");
      process.exit(1);
    }
    
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
