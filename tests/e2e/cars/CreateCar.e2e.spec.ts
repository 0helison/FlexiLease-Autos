import 'reflect-metadata';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { dataSource } from '@shared/infra/typeorm';
import CreateCarService from '@modules/cars/services/CreateCarService';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('CreateCar', () => {
  let createCarService: CreateCarService;

  let token: string;

  const userCarCreate = {
    name: 'User Car Create',
    cpf: '655.333.444-55',
    birthday: '17/08/2001',
    email: 'user_car_create1@mail.com',
    password: '1234567',
    qualified: 'yes',
    cep: '58340-000',
  };

  const carCreate = {
    model: 'Gol G5',
    color: 'white',
    year: '1980',
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

  const carCreate2 = {
    model: 'Gol G5',
    color: 'white',
    year: '1949',
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

  const carCreate3 = {
    model: 'Gol G5',
    color: 'white',
    year: '2024',
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

  const carCreate4 = {
    model: 'Gol G5',
    color: 'white',
    year: '2021',
    value_per_day: 100,
    number_of_passengers: 3,
    accessories: [
      {
        description: 'Gps',
      },
      {
        description: 'gps',
      },
    ],
  };

  beforeEach(() => {
    createCarService = container.resolve(CreateCarService);
  });

  it('Should be able to create a new car', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarCreate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userCarCreate.email,
      password: userCarCreate.password,
    });

    token = auth.body.token;

    const response = await supertest(app)
      .post('/api/v1/car')
      .send(carCreate)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.CREATED);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('model', carCreate.model);
    expect(response.body).toHaveProperty('color', carCreate.color);
    expect(response.body).toHaveProperty('year', carCreate.year);
    expect(response.body).toHaveProperty(
      'value_per_day',
      carCreate.value_per_day,
    );
    expect(response.body).toHaveProperty(
      'number_of_passengers',
      carCreate.number_of_passengers,
    );
    expect(response.body.accessories).toBeInstanceOf(Array);

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to create car manufactured before 1950', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarCreate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userCarCreate.email,
      password: userCarCreate.password,
    });

    const token = auth.body.token;

    const response = await supertest(app)
      .post('/api/v1/car')
      .send(carCreate2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to create car manufactured after 2023', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarCreate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userCarCreate.email,
      password: userCarCreate.password,
    });

    const token = auth.body.token;

    const response = await supertest(app)
      .post('/api/v1/car')
      .send(carCreate3)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be possible to create to repeat accessoriesof car', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarCreate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userCarCreate.email,
      password: userCarCreate.password,
    });

    const token = auth.body.token;

    const response = await supertest(app)
      .post('/api/v1/car')
      .send(carCreate4)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
