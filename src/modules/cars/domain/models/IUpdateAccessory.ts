import { ObjectId } from 'mongodb';
import { IAccessory } from './ICar';

export interface IUpdateAccessory {
  _id: ObjectId;
  _id_accessory: ObjectId;
  description: string;
}
