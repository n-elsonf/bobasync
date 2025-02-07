import { Document, Model } from "mongoose";

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
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  googleId?: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// export interface IUserMethods {
//   comparePassword(candidatePassword: string): Promise<boolean>;
//   getPublicProfile(): Partial<IUser>;
// }

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): Partial<IUser>;
}

export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findByEmail(
    email: string
  ): Promise<Document<unknown, any, IUser> & IUser & IUserMethods>;
}
