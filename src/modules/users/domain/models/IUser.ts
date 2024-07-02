import { ObjectId } from 'mongodb';

export interface IUser {
  _id: ObjectId;
  name: string;
  cpf: string;
  birthday: Date;
  email: string;
  password: string;
  qualified: 'yes' | 'no';
  cep: string;
  complement: string;
  neighborhood: string;
  locality: string;
  uf: string;
}
