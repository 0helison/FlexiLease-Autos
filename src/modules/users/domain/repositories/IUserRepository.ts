import { ObjectId } from 'mongodb';
import { ICreateUser } from '../models/ICreateUser';
import { IUser } from '../models/IUser';
import { IPaginateUser } from '../models/IPaginateUser';

interface SearchParams {
  limit: number;
  offset: number;
}

export interface IUsersRepository {
  findAll(params: SearchParams): Promise<IPaginateUser>;
  findById(_id: ObjectId): Promise<IUser | null>;
  findByCpf(cpf: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(data: ICreateUser): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
  remove(data: IUser): Promise<void>;
}
