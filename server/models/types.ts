import mongoose from "mongoose";

// export interface IUser {
//   name: string;
//   email: string;
//   password: string;
//   googleId?: string;
//   profilePicture?: string;
//   role: "user" | "admin";
//   isEmailVerified: boolean;
//   verificationToken?: string;
//   resetPasswordToken?: string;
//   resetPasswordExpire?: Date;
//   lastLogin?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// Interface to define the User document structure
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: "user" | "admin";
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  profilePicture?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// export interface IUserMethods {
//   comparePassword(candidatePassword: string): Promise<boolean>;
//   getPublicProfile(): Partial<IUser>;
// }

export type UserModel = mongoose.Model<IUser>;
