import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import ListUserService from '@modules/users/services/ListUserService';
import { IUser } from '@modules/users/domain/models/IUser';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('ListUser', () => {
  let listUserService: ListUserService;

  const userList = {
    name: 'User List',
    cpf: '444.000.444-66',
    birthday: '12/05/2000',
    email: 'user_list@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userList2 = {
    name: 'User List 2',
    cpf: '144.010.444-77',
    birthday: '12/05/2000',
    email: 'user_list2@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  let token: string;

  beforeEach(() => {
    listUserService = container.resolve(ListUserService);
  });

  it('Should be able to list users with query', async () => {
    await supertest(app).post('/api/v1/user').send(userList);

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userList.email,
      password: userList.password,
    });

    token = authResponse.body.token;

    const response = await supertest(app)
      .get(
        '/api/v1/user?name=User%20List&email=user_list@mail.com&qualified=yes&cep=58340-000&complement=N/A&neighborhood=N/A&locality=Sapé&uf=PB&birthday=12/05/2000',
      )
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.users).toBeInstanceOf(Array);
    expect(response.body.users.length).toBeGreaterThan(0);
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('offset');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('offsets');

    response.body.users.forEach((user: IUser) => {
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('name', userList.name);
      expect(user).toHaveProperty('cpf', userList.cpf);
      expect(user).toHaveProperty('birthday', userList.birthday);
      expect(user).toHaveProperty('email', userList.email);
      expect(user).toHaveProperty('qualified', userList.qualified);
      expect(user).toHaveProperty('cep', userList.cep);
      expect(user).toHaveProperty('complement', 'N/A');
      expect(user).toHaveProperty('neighborhood', 'N/A');
      expect(user).toHaveProperty('locality', 'Sapé');
      expect(user).toHaveProperty('uf', 'PB');
    });
  });

  it('Should be able to list users', async () => {
    await supertest(app).post('/api/v1/user').send(userList2);

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userList2.email,
      password: userList2.password,
    });

    token = authResponse.body.token;

    const response = await supertest(app)
      .get('/api/v1/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.users).toBeInstanceOf(Array);
    expect(response.body.users.length).toBeGreaterThan(1);
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('offset');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('offsets');
  });
});
