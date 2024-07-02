import { ObjectId } from 'mongodb';

export interface IUpdateAccessory {
  _id: ObjectId;
  _id_accessory: ObjectId;
  description: string;
}
