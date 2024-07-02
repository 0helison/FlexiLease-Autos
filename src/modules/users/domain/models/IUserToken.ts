import { ObjectId } from 'mongodb';

export interface IUserToken {
  id: ObjectId;
  token: string;
  user_id: ObjectId;
}
