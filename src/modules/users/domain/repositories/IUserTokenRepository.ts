import { ObjectId } from 'mongodb';
import { IUserToken } from '../models/IUserToken';

export interface IUserTokensRepository {
  findByToken(token: string): Promise<IUserToken | null>;
  generate(user_id: ObjectId): Promise<IUserToken>;
}
