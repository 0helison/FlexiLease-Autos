import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import { USER_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import { NOT_FOUND } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import DeleteUserService from '@modules/users/services/DeleteUserService';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('DeleteUser', () => {
  let deleteUserService: DeleteUserService;

  const userDelete = {
    name: 'User Delete',
    cpf: '444.000.444-44',
    birthday: '12/05/2000',
    email: 'user_delete@mail.com',
    password: '123456',
    qualified: 'no',
    cep: '58340-000',
  };

  const nonExistentUserError = {
    code: HttpStatusCode.NOT_FOUND,
    status: NOT_FOUND,
    message: USER_NOT_FOUND,
    details: [],
  };

  let token: string;
  let userId: number;

  beforeEach(() => {
    deleteUserService = container.resolve(DeleteUserService);
  });

  it('Should be able to delete a user by ID', async () => {
    const createResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userDelete);

    userId = createResponse.body._id;

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userDelete.email,
      password: userDelete.password,
    });

    token = authResponse.body.token;

    const response = await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NO_CONTENT);
  });

  it('Should not be possible to delete a non-existent user', async () => {
    await supertest(app).post('/api/v1/user').send(userDelete);

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userDelete.email,
      password: userDelete.password,
    });

    token = authResponse.body.token;

    const response = await supertest(app)
      .delete(`/api/v1/user/6682b4ea7372a45569e12f17`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentUserError);
  });
});
