import { IUser } from './IUser';

export interface IPaginateUser {
  users: IUser[];
  limit: number;
  total: number;
  offset: number;
  offsets: number;
}
