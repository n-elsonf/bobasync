
import { Document } from 'mongoose';
import { IUser, IUserMethods } from './user';

declare global {
  namespace Express {
    interface Request {
      user?: Document &  IUser & IUserMethods;
    }
  }
}