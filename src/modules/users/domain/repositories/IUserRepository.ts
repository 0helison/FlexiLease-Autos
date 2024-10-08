import { ObjectId } from 'mongodb';
import { ICreateUser } from '../models/ICreateUser';
import { IUser } from '../models/IUser';
import { IPaginateUser } from '../models/IPaginateUser';
import { ISearchParamsList } from '../models/ISearchParamsList';

export interface IUsersRepository {
  findAll(params: ISearchParamsList): Promise<IPaginateUser>;
  findById(_id: ObjectId): Promise<IUser | null>;
  findByCpf(cpf: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(data: ICreateUser): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
  remove(data: IUser): Promise<void>;
}
