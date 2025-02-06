import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  googleId?: string;
  profilePicture?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): Partial<IUser>;
}

export type UserModel = mongoose.Model<IUser, {}, IUserMethods>;
