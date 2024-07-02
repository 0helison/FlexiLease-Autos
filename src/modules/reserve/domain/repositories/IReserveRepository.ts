import { IReserve } from '../models/IReserve';
import { ICreateReserve } from '../models/ICreateReserve';
import { ObjectId } from 'mongodb';
import { IPaginateReserve } from '../models/IPaginateReserve';
import { ISearchParamsList } from '../models/ISearchParamsList';

export interface IReserveRepository {
  create(data: ICreateReserve): Promise<IReserve>;
  save(reserve: IReserve): Promise<IReserve>;
  findByCarAndDate(_id_car: ObjectId, date: Date): Promise<IReserve | null>;
  findByUserId(_id_user: ObjectId): Promise<IReserve[]>;
  findById(_id: ObjectId): Promise<IReserve | null>;
  remove(data: IReserve): Promise<void>;
  findAll(searchParams: ISearchParamsList): Promise<IPaginateReserve>;
}
