import { Qualified } from '../enums/Qualified';

export interface ICreateUser {
  name: string;
  cpf: string;
  birthday: Date;
  email: string;
  password: string;
  qualified: Qualified;
  cep: string;
  complement: string;
  neighborhood: string;
  locality: string;
  uf: string;
}
