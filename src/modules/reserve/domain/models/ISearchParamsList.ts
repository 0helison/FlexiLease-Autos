import { ObjectId } from 'mongodb';

export interface ISearchParamsList {
  offset: number;
  limit: number;
  _id_user?: ObjectId;
  _id_car?: ObjectId;
  start_date?: Date;
  end_date?: Date;
  final_value?: number;
}
