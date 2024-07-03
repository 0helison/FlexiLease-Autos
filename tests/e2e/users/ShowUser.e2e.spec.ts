import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import ShowUsersService from '@modules/users/services/ShowUserService';
import { NOT_FOUND } from '@shared/consts/ErrorsConsts';
import { USER_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('ShowUser', () => {
  let showUserService: ShowUsersService;

  const userShow = {
    name: 'User Show',
    cpf: '444.000.444-88',
    birthday: '12/05/2000',
    email: 'user_show@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  let token: string;
  let userId: number;

  const nonExistentUserError = {
    code: HttpStatusCode.NOT_FOUND,
    status: NOT_FOUND,
    message: USER_NOT_FOUND,
    details: [],
  };

  beforeEach(() => {
    showUserService = container.resolve(ShowUsersService);
  });

  it('Should be able to show a user by ID', async () => {
    const createResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userShow);

    userId = createResponse.body._id;

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userShow.email,
      password: userShow.password,
    });

    token = authResponse.body.token;

    const response = await supertest(app)
      .get(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toHaveProperty('_id', userId);
    expect(response.body).toHaveProperty('name', userShow.name);
    expect(response.body).toHaveProperty('cpf', userShow.cpf);
    expect(response.body).toHaveProperty('birthday', userShow.birthday);
    expect(response.body).toHaveProperty('email', userShow.email);
    expect(response.body).toHaveProperty('qualified', userShow.qualified);
    expect(response.body).toHaveProperty('cep', userShow.cep);
    expect(response.body).toHaveProperty('complement');
    expect(response.body).toHaveProperty('neighborhood');
    expect(response.body).toHaveProperty('locality');
    expect(response.body).toHaveProperty('uf');
  });

  it('Should not be possible to show a non-existent user', async () => {
    await supertest(app).post('/api/v1/user').send(userShow);

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userShow.email,
      password: userShow.password,
    });

    token = authResponse.body.token;

    const response = await supertest(app)
      .get(`/api/v1/user/6682b4ea7372a45569e12f17`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentUserError);
  });
});
