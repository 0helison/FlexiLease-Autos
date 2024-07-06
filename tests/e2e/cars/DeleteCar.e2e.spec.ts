import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import { NOT_FOUND } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import DeleteCarService from '@modules/cars/services/DeleteCarService';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('DeleteCar', () => {
  let deleteCarService: DeleteCarService;

  const userCarDelete = {
    name: 'User Car Delete',
    cpf: '212.000.444-22',
    birthday: '12/05/2000',
    email: 'user_car_delete@mail.com',
    password: '123456',
    qualified: 'no',
    cep: '58340-000',
  };

  const carDelete = {
    model: 'Gol G5',
    color: 'white',
    year: '1950',
    value_per_day: 100,
    number_of_passengers: 3,
    accessories: [
      {
        description: 'led',
      },
      {
        description: 'gps',
      },
    ],
  };

  const nonExistentCarError = {
    code: HttpStatusCode.NOT_FOUND,
    status: NOT_FOUND,
    message: CAR_NOT_FOUND,
    details: [],
  };

  beforeEach(() => {
    deleteCarService = container.resolve(DeleteCarService);
  });

  it('Should be able to delete a car by ID', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarDelete);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userCarDelete.email,
      password: userCarDelete.password,
    });

    const token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carDelete)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(app)
      .delete(`/api/v1/car/${car.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NO_CONTENT);

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be possible to delete a non-existent car', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarDelete);

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userCarDelete.email,
      password: userCarDelete.password,
    });

    const token = authResponse.body.token;

    const response = await supertest(app)
      .delete(`/api/v1/car/6682b4ea7372a45569e12f17`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentCarError);

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
