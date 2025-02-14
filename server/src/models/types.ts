import { Document, Model } from "mongoose";

// Interface to define the User document structure
export interface IUser extends Document {
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

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): Partial<IUser>;
}

export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findByEmail(
    email: string
  ): Promise<Document<unknown, any, IUser> & IUser & IUserMethods>;
}
