import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import {
  CPF_ALREADY_USED,
  EMAIL_ALREADY_USED,
  UNDERAGE_USER,
} from '@shared/consts/ErrorMessagesConsts';
import { BAD_REQUEST } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import CreateUserService from '@modules/users/services/CreateUserService';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('CreateUser', () => {
  let createUserService: CreateUserService;

  const userCreate = {
    name: 'User Create',
    cpf: '555.000.444-11',
    birthday: '17/08/2000',
    email: 'user_create@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userCreate2 = {
    name: 'User Create 2',
    cpf: '555.000.444-22',
    birthday: '17/08/2000',
    email: 'user_create@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userCreate3 = {
    name: 'User Create 3',
    cpf: '555.000.444-33',
    birthday: '17/08/2020',
    email: 'user_create@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const errorExistentCpf = {
    code: HttpStatusCode.BAD_REQUEST,
    status: BAD_REQUEST,
    message: CPF_ALREADY_USED,
    details: [],
  };

  const errorExistentEmail = {
    code: HttpStatusCode.BAD_REQUEST,
    status: BAD_REQUEST,
    message: EMAIL_ALREADY_USED,
    details: [],
  };

  const errorUnderageUser = {
    code: HttpStatusCode.BAD_REQUEST,
    status: BAD_REQUEST,
    message: UNDERAGE_USER,
    details: [],
  };

  beforeEach(() => {
    createUserService = container.resolve(CreateUserService);
  });

  it('Should be able to create a new User', async () => {
    const response = await supertest(app).post('/api/v1/user').send(userCreate);

    expect(response.status).toBe(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(userCreate.name);
    expect(response.body.cpf).toBe(userCreate.cpf);
    expect(response.body.birthday).toBe(userCreate.birthday);
    expect(response.body.email).toBe(userCreate.email);
    expect(response.body.qualified).toBe(userCreate.qualified);
    expect(response.body.cep).toBe(userCreate.cep);
    expect(response.body).toHaveProperty('complement');
    expect(response.body).toHaveProperty('neighborhood');
    expect(response.body).toHaveProperty('locality');
    expect(response.body).toHaveProperty('uf');
  });

  it('Should not be possible to create a new user with an existing email', async () => {
    await supertest(app).post('/api/v1/user').send(userCreate);

    const response = await supertest(app)
      .post('/api/v1/user')
      .send(userCreate2);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(errorExistentEmail);
  });

  it('Should not be possible to create a new user with an existing cpf', async () => {
    await supertest(app).post('/api/v1/user').send(userCreate);

    const response = await supertest(app).post('/api/v1/user').send(userCreate);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(errorExistentCpf);
  });

  it('Should not be possible to create a new user under 18 years', async () => {
    await supertest(app).post('/api/v1/user').send(userCreate);

    const response = await supertest(app)
      .post('/api/v1/user')
      .send(userCreate3);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(errorUnderageUser);
  });
});
