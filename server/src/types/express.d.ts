
import { Types, Document } from 'mongoose';
import { IUser, IUserMethods } from './user';

declare namespace Express {
  // Define the User interface inside Express namespace
  interface User extends IUser, IUserMethods {
    _id: Types.ObjectId;
  }
  export interface Request {
    user?: User;
  }

  export interface Response {
    user?: User;
  }

}