import 'reflect-metadata';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { dataSource } from '@shared/infra/typeorm';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import UpdateCarService from '@modules/cars/services/UpdateCarService';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('UpdateCar', () => {
  let updateCarService: UpdateCarService;

  let token: string;
  let carId: string;

  const userCarUpdate = {
    name: 'User Car Update',
    cpf: '666.333.444-77',
    birthday: '17/08/2000',
    email: 'user_car_update@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const carUpdate = {
    model: 'Gol G5',
    color: 'white',
    year: '2015',
    value_per_day: 200,
    number_of_passengers: 4,
    accessories: [
      {
        description: 'led',
      },
      {
        description: 'gps',
      },
    ],
  };

  const carUpdate2 = {
    model: 'Polo',
    color: 'blue',
    year: '2020',
    value_per_day: 300,
    number_of_passengers: 5,
  };

  const carUpdate3 = {
    model: 'Gol G5',
    color: 'white',
    year: '2024',
    value_per_day: 100,
    number_of_passengers: 3,
  };

  const carUpdate4 = {
    model: 'Gol G5',
    color: 'white',
    year: '1949',
    value_per_day: 100,
    number_of_passengers: 3,
  };

  beforeEach(() => {
    updateCarService = container.resolve(UpdateCarService);
  });

  it('Should be able to update all car', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarUpdate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userCarUpdate.email,
      password: userCarUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const response = await supertest(app)
      .put(`/api/v1/car/${carId}`)
      .send(carUpdate2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.model).toBe(carUpdate2.model);
    expect(response.body.color).toBe(carUpdate2.color);
    expect(response.body.year).toBe(carUpdate2.year);
    expect(response.body.value_per_day).toBe(carUpdate2.value_per_day);
    expect(response.body.number_of_passengers).toBe(
      carUpdate2.number_of_passengers,
    );

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to create car manufactured after 2023', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarUpdate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userCarUpdate.email,
      password: userCarUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const response = await supertest(app)
      .put(`/api/v1/car/${carId}`)
      .send(carUpdate3)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to create car manufactured before 1950', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarUpdate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userCarUpdate.email,
      password: userCarUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const response = await supertest(app)
      .put(`/api/v1/car/${carId}`)
      .send(carUpdate4)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
