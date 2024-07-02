import { ObjectId } from 'mongodb';
import { ICar } from '../models/ICar';
import { ICreateCar } from '../models/ICreateCar';
import { IPaginateCar } from '../models/IPaginateCar';

interface SearchParams {
  limit: number;
  offset: number;
  model?: string;
  color?: string;
  year?: string;
  value_per_day?: number;
  number_of_passengers?: number;
  accessories?: Array<{ description: string }>;
}

export interface ICarRepository {
  create(data: ICreateCar): Promise<ICar>;
  save(car: ICar): Promise<ICar>;
  findById(_id: ObjectId): Promise<ICar | null>;
  remove(data: ICar): Promise<void>;
  findAll(searchParams: SearchParams): Promise<IPaginateCar>;
}
