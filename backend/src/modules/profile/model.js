import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", unique: true, sparse: true },
    name: String,
    headline: String,
    bioMarkdown: String,
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    imagePath: String
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", ProfileSchema);
