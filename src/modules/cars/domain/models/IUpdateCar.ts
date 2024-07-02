import { ObjectId } from 'mongodb';

export interface IUpdateCar {
  _id: ObjectId;
  model: string;
  color: string;
  year: string;
  value_per_day: number;
  number_of_passengers: number;
}
