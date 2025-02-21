import { Document, Model, Schema } from "mongoose";

// Friend request interface
export interface IFriendRequest {
  _id: Schema.Types.ObjectId;
  // friendId who sent the request
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
  // Map from requestId to friend request
  friendRequests: IFriendRequest[];
  // List of blocked users
  blockedUsers: Schema.Types.ObjectId[];

  // fields not included in schema
  // Map from requestId to friend request
  friendRequestsWithRequestId: Map<Schema.Types.ObjectId, IFriendRequest>;
  // Map from senderId to friend request
  friendRequestsWithSenderId: Map<Schema.Types.ObjectId, IFriendRequest>;

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
