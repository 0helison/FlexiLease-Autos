import { ObjectId } from 'mongodb';
import { IAccessory } from './ICar';

export interface IUpdateCar {
  _id: ObjectId;
  model: string;
  color: string;
  year: string;
  value_per_day: number;
  number_of_passengers: number;
}
