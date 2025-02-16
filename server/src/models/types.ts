import { Document, Model, Schema } from "mongoose";

// Friend request interface
interface IFriendRequest {
  _id: Schema.Types.ObjectId;
  from: Schema.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

// Interface to define the User document structure
export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
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
  
  // Friend-related fields
  friends: Schema.Types.ObjectId[];
  friendRequests: IFriendRequest[];
  blockedUsers: Schema.Types.ObjectId[];
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): Partial<IUser>;
  sendFriendRequest(friendId: string): Promise<void>;
  acceptFriendRequest(requestId: string): Promise<void>;
  rejectFriendRequest(requestId: string): Promise<void>;
  removeFriend(friendId: string): Promise<void>;
}

// Public user data type (for API responses)
export type PublicUser = Omit<
  IUser,
  | 'password'
  | 'verificationToken'
  | 'resetPasswordToken'
  | 'resetPasswordExpire'
  | 'blockedUsers'
>;

// Friend request response type
export type FriendRequestResponse = {
  _id: string;
  from: PublicUser;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
};

export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findByEmail(
    email: string
  ): Promise<Document<unknown, any, IUser> & IUser & IUserMethods>;
}
