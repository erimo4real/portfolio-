import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model("ContactMessage", ContactSchema);
