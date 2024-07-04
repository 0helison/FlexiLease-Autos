import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import { NOT_FOUND } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import ShowCarService from '@modules/cars/services/ShowCarService';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('ShowCar', () => {
  let showCarService: ShowCarService;

  const userCarShow = {
    name: 'User Car Delete',
    cpf: '212.212.212-22',
    birthday: '12/05/2000',
    email: 'user_car_show@mail.com',
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
    showCarService = container.resolve(ShowCarService);
  });

  it('Should be able to show a car by ID', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarShow);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userCarShow.email,
      password: userCarShow.password,
    });

    const token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carDelete)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(app)
      .get(`/api/v1/car/${car.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be possible to show a non-existent car', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarShow);

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userCarShow.email,
      password: userCarShow.password,
    });

    const token = authResponse.body.token;

    const response = await supertest(app)
      .get(`/api/v1/car/6682b4ea7372a45569e12f14`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentCarError);

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
