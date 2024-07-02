import { ICar } from './ICar';

export interface IPaginateCar {
  cars: ICar[];
  limit: number;
  total: number;
  offset: number;
  offsets: number;
}
