import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import {
  CPF_ALREADY_USED,
  EMAIL_ALREADY_USED,
  UNDERAGE_USER,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorMessagesConsts';
import { BAD_REQUEST, NOT_FOUND } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import UpdateUserService from '@modules/users/services/UpdateUserService';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('UpdateUser', () => {
  let updateUserService: UpdateUserService;

  const userUpdate = {
    name: 'User Update',
    cpf: '999.888.444-11',
    birthday: '17/08/2000',
    email: 'user_update@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userUpdate2 = {
    name: 'User Update 2',
    cpf: '999.888.444-22',
    birthday: '11/08/2002',
    email: 'user_update2@mail.com',
    password: '1234567',
    qualified: 'no',
    cep: '58345-000',
  };

  const userUpdate3 = {
    name: 'User Update 3',
    cpf: '999.888.444-22',
    birthday: '17/08/2000',
    email: 'user_update3@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userUpdate4 = {
    name: 'User Update 4',
    cpf: '999.888.444-44',
    birthday: '17/08/2000',
    email: 'user_update4@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userUpdate5 = {
    name: 'User Update 5',
    cpf: '999.888.444-55',
    birthday: '17/08/2003',
    email: 'user_update2@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userUpdate6 = {
    name: 'User Update 5',
    cpf: '999.888.444-66',
    birthday: '17/08/2003',
    email: 'user_update6@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userUpdate7 = {
    name: 'User Update 5',
    cpf: '999.888.444-77',
    birthday: '17/08/2023',
    email: 'user_update7@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userUpdate8 = {
    name: 'User Update 5',
    cpf: '999.888.444-88',
    birthday: '17/08/2003',
    email: 'user_update8@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userUpdate9 = {
    name: 'User Update 9',
    cpf: '999.888.444-99',
    birthday: '17/08/2003',
    email: 'user_update9@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userUpdate10 = {
    name: 'User Update 10',
    cpf: '999.888.444-99',
    birthday: '20/09/2002',
    email: 'user_update9@mail.com',
    password: '01234567',
    qualified: 'no',
    cep: '58345-000',
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

  const nonExistentUserError = {
    code: HttpStatusCode.NOT_FOUND,
    status: NOT_FOUND,
    message: USER_NOT_FOUND,
    details: [],
  };

  beforeEach(() => {
    updateUserService = container.resolve(UpdateUserService);
  });

  it('Should be able to update all fields', async () => {
    const createResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userUpdate);

    const userId = createResponse.body._id;

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userUpdate.email,
      password: userUpdate.password,
    });

    const token = authResponse.body.token;

    const response = await supertest(app)
      .put(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(userUpdate2);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toHaveProperty('_id', userId);
    expect(response.body.name).toBe(userUpdate2.name);
    expect(response.body.cpf).toBe(userUpdate2.cpf);
    expect(response.body.birthday).toBe(userUpdate2.birthday);
    expect(response.body.email).toBe(userUpdate2.email);
    expect(response.body.qualified).toBe(userUpdate2.qualified);
    expect(response.body.cep).toBe(userUpdate2.cep);
    expect(response.body).toHaveProperty('complement');
    expect(response.body).toHaveProperty('neighborhood');
    expect(response.body).toHaveProperty('locality');
    expect(response.body).toHaveProperty('uf');
  });

  it('Should not be possible to update to existing cpf', async () => {
    const createResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userUpdate);

    const userId = createResponse.body._id;

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userUpdate.email,
      password: userUpdate.password,
    });

    const token = authResponse.body.token;

    const response = await supertest(app)
      .put(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(userUpdate3);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(errorExistentCpf);
  });

  it('Should not be possible to update to existing email', async () => {
    const createResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userUpdate4);

    const userId = createResponse.body._id;

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userUpdate4.email,
      password: userUpdate4.password,
    });

    const token = authResponse.body.token;

    const response = await supertest(app)
      .put(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(userUpdate5);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(errorExistentEmail);
  });

  it('Should not be possible to update for a user under 18 years', async () => {
    const createResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userUpdate6);

    const userId = createResponse.body._id;

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userUpdate6.email,
      password: userUpdate6.password,
    });

    const token = authResponse.body.token;

    const response = await supertest(app)
      .put(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(userUpdate7);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(errorUnderageUser);
  });

  it('Should not be possible to update a non-existent user', async () => {
    await supertest(app).post('/api/v1/user').send(userUpdate8);

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userUpdate8.email,
      password: userUpdate8.password,
    });

    const token = authResponse.body.token;

    const response = await supertest(app)
      .put(`/api/v1/user/6682b4ea7372a45569e12f17`)
      .set('Authorization', `Bearer ${token}`)
      .send(userUpdate7);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentUserError);
  });

  it('Should be able to update only the name, birthday, password, qualified and cep', async () => {
    const createResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userUpdate9);

    const userId = createResponse.body._id;

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userUpdate9.email,
      password: userUpdate9.password,
    });

    const token = authResponse.body.token;

    const response = await supertest(app)
      .put(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(userUpdate10);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toHaveProperty('_id', userId);
    expect(response.body.name).toBe(userUpdate10.name);
    expect(response.body.cpf).toBe(userUpdate10.cpf);
    expect(response.body.birthday).toBe(userUpdate10.birthday);
    expect(response.body.email).toBe(userUpdate10.email);
    expect(response.body.qualified).toBe(userUpdate10.qualified);
    expect(response.body.cep).toBe(userUpdate10.cep);
    expect(response.body).toHaveProperty('complement');
    expect(response.body).toHaveProperty('neighborhood');
    expect(response.body).toHaveProperty('locality');
    expect(response.body).toHaveProperty('uf');
  });
});
