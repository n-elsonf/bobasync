import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IUserMethods, UserModel } from "./types";

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
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
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    profilePicture: {
      type: String,
      default: "default-avatar.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Method to get public profile
userSchema.methods.getPublicProfile = function (this: IUser): Partial<IUser> {
  const userObject = this.toObject();
  const {
    password,
    verificationToken,
    resetPasswordToken,
    resetPasswordExpire,
    ...publicProfile
  } = userObject;
  return publicProfile;
};

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
