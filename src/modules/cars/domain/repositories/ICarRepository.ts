import { ObjectId } from 'mongodb';
import { ICar } from '../models/ICar';
import { ICreateCar } from '../models/ICreateCar';
import { IPaginateCar } from '../models/IPaginateCar';
import { ISearchParamsList } from '../models/ISearchParamsList';

export interface ICarRepository {
  create(data: ICreateCar): Promise<ICar>;
  save(car: ICar): Promise<ICar>;
  findById(_id: ObjectId): Promise<ICar | null>;
  remove(data: ICar): Promise<void>;
  findAll(searchParams: ISearchParamsList): Promise<IPaginateCar>;
}
