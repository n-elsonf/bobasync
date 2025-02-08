// src/models/User.ts
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IUserMethods, IUserModel } from "./types";

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values to be unique
    },
    profilePicture: {
      type: String,
      default: "default-avatar.png",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
  this: IUser & Document,
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Method to get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function (
  this: IUser & Document
): Partial<IUser> {
  const userObject = this.toObject();
  const {
    password,
    verificationToken,
    resetPasswordToken,
    resetPasswordExpire,
    ...publicData
  } = userObject;

  return publicData;
};

// Static method to find user by email
userSchema.static("findByEmail", async function findByEmail(email: string) {
  return this.findOne({ email });
});

// Virtual for full name
userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.name}`;
});

// Create the model
const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;

// Example usage:
/*
import User from './models/User';

// Create new user
const createUser = async () => {
  try {
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    return user.getPublicProfile();
  } catch (error) {
    throw error;
  }
};

// Find user by email
const findUser = async (email: string) => {
  const user = await User.findByEmail(email);
  return user?.getPublicProfile();
};

// Compare password
const validatePassword = async (user: IUser & Document, password: string) => {
  return await user.comparePassword(password);
};
*/
