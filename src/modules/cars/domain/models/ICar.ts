import { ObjectId } from 'mongodb';

export interface IAccessory {
  _id: ObjectId;
  description: string;
}

export interface ICar {
  _id: ObjectId;
  model: string;
  color: string;
  year: string;
  value_per_day: number;
  number_of_passengers: number;
  accessories: IAccessory[];
}
