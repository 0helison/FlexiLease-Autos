import 'reflect-metadata';
import supertest from 'supertest';
import AuthUserService from '@modules/users/services/AuthUserService';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import { EMAIL_PASSWORD_INVALID } from '@shared/consts/ErrorMessagesConsts';
import { UNAUTHORIZED } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('AuthUser', () => {
  let authUserService: AuthUserService;

  const userAuth = {
    name: 'User Auth',
    cpf: '444.000.444-11',
    birthday: '12/05/2000',
    email: 'user_auth@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const expectedAuthErrorResponse = {
    code: HttpStatusCode.UNAUTHORIZED,
    status: UNAUTHORIZED,
    message: EMAIL_PASSWORD_INVALID,
    details: [],
  };

  beforeEach(() => {
    authUserService = container.resolve(AuthUserService);
  });

  it('Should be able to authenticate', async () => {
    await supertest(app).post('/api/v1/user').send(userAuth);

    const response = await supertest(app).post('/api/v1/auth').send({
      email: userAuth.email,
      password: userAuth.password,
    });

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toHaveProperty('token');
  });

  it('Should not be able to authenticate with non existent user', async () => {
    await supertest(app).post('/api/v1/user').send(userAuth);

    const response = await supertest(app).post('/api/v1/auth').send({
      email: 'nonexistent@mail.com',
      password: userAuth.password,
    });

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(response.body).toEqual(expectedAuthErrorResponse);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    await supertest(app).post('/api/v1/user').send(userAuth);

    const response = await supertest(app).post('/api/v1/auth').send({
      email: userAuth.email,
      password: 'incorrectPassword',
    });

    expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(response.body).toEqual(expectedAuthErrorResponse);
  });
});
