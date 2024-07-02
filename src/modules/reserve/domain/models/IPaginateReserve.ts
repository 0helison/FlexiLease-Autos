import { IReserve } from './IReserve';

export interface IPaginateReserve {
  reserves: IReserve[];
  limit: number;
  total: number;
  offset: number;
  offsets: number;
}
