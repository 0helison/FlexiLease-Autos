export interface ICreateUser {
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
