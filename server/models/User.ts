import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, UserModel } from "./types";

// User Schema definition
const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must bed at least 8 characters long"],
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastLogin: {
      type: Date,
    },
    profilePicture: {
      type: String,
    },
    phoneNumber: {
      type: String,
      match: [
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        "Please enter a valid phone number",
      ],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password; // Remove password when converting to JSON
        return ret;
      },
    },
  }
);

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// Add any pre-save middleware (e.g., for password hashing)
userSchema.pre("save", async function (next) {
  // Add your password hashing logic here if needed
  next();
});

// Create and export the model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
