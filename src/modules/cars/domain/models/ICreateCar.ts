import { IAccessory } from './ICar';

export interface ICreateCar {
  model: string;
  color: string;
  year: string;
  value_per_day: number;
  number_of_passengers: number;
  accessories: IAccessory[];
}
