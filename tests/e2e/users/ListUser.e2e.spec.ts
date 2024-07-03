import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import ListUserService from '@modules/users/services/ListUserService';

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

  let token: string;

  beforeEach(() => {
    listUserService = container.resolve(ListUserService);
  });

  it('Should be able to list users', async () => {
    await supertest(app).post('/api/v1/user').send(userList);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userList.email,
      password: userList.password,
    });

    token = auth.body.token;

    const response = await supertest(app)
      .get('/api/v1/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.users).toBeInstanceOf(Array);
    expect(response.body.users.length).toBeGreaterThan(0);
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('offset');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('offsets');
  });
});
