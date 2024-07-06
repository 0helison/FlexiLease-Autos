import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import ListUserService from '@modules/users/services/ListUserService';
import UserRepositoryInMemory from '@modules/users/infra/typeorm/repositories/inMemory/UserRepositoryInMemory';
import { ISearchParamsList } from '@modules/users/domain/models/ISearchParamsList';
import { IPaginateUser } from '@modules/users/domain/models/IPaginateUser';
import { Qualified } from '@modules/users/domain/enums/Qualified';

describe('ListUserService', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let listUserService: ListUserService;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    listUserService = new ListUserService(userRepositoryInMemory);
  });

  it('should be able to list all users without filter', async () => {
    const usersData = [
      {
        name: 'Paulo',
        cpf: '111.111.111-11',
        birthday: new Date('1990-01-01'),
        email: 'paulo@example.com',
        password: 'password1',
        qualified: 'yes' as Qualified,
        cep: '58000-000',
        complement: 'Apt. 1',
        neighborhood: 'Centro',
        locality: 'João Pessoa',
        uf: 'PB',
      },
      {
        name: 'Ana',
        cpf: '222.222.222-22',
        birthday: new Date('1990-02-02'),
        email: 'ana@example.com',
        password: 'password2',
        qualified: 'yes' as Qualified,
        cep: '58300-000',
        complement: 'Apt. 2',
        neighborhood: 'Centro',
        locality: 'Campina Grande',
        uf: 'PB',
      },
    ];

    await Promise.all(
      usersData.map(userData => userRepositoryInMemory.create(userData)),
    );

    const params: ISearchParamsList = {
      limit: 10,
      offset: 0,
    };

    const result: IPaginateUser = await listUserService.execute(params);

    expect(result.users).toHaveLength(2);
  });

  it('should be able to list users with pagination', async () => {
    const usersData = [
      {
        name: 'Maria',
        cpf: '111.111.111-11',
        birthday: new Date('1990-01-01'),
        email: 'maria@example.com',
        password: 'password1',
        qualified: 'yes' as Qualified,
        cep: '58000-000',
        complement: 'Apt. 1',
        neighborhood: 'Centro',
        locality: 'João Pessoa',
        uf: 'PB',
      },
      {
        name: 'João',
        cpf: '222.222.222-22',
        birthday: new Date('1990-02-02'),
        email: 'joao@example.com',
        password: 'password2',
        qualified: 'yes' as Qualified,
        cep: '58300-000',
        complement: 'Apt. 2',
        neighborhood: 'Centro',
        locality: 'Campina Grande',
        uf: 'PB',
      },
    ];

    await Promise.all(
      usersData.map(userData => userRepositoryInMemory.create(userData)),
    );

    const params: ISearchParamsList = {
      limit: 1,
      offset: 0,
    };

    const result1: IPaginateUser = await listUserService.execute(params);

    expect(result1.users).toHaveLength(1);
    expect(result1.total).toBe(2);

    params.offset = 1;
    const result2: IPaginateUser = await listUserService.execute(params);

    expect(result2.users).toHaveLength(1);
    expect(result2.offset).toBe(1);
  });
});
