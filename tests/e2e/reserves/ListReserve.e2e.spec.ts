import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import ListReserveService from '@modules/reserve/services/ListReserveService';
import { IReserve } from '@modules/reserve/domain/models/IReserve';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('ListReserve', () => {
  let listReserveService: ListReserveService;

  let token: string;
  let userId: string;
  let carId: string;
  let reserveId: string;

  const userReserveDelete = {
    name: 'User Reserve List',
    cpf: '214.215.555-33',
    birthday: '12/05/2000',
    email: 'user_reserve_list@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const carReserveDelete = {
    model: 'Gol G5',
    color: 'white',
    year: '2020',
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

  beforeEach(() => {
    listReserveService = container.resolve(ListReserveService);
  });

  it('Should be able to list reserve with query', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveDelete);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveDelete.email,
      password: userReserveDelete.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveDelete)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const reserveData = {
      _id_user: userId,
      _id_car: carId,
      start_date: '07/08/2015',
      end_date: '10/08/2015',
    };

    const reserve = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    reserveId = reserve.body._id;

    const response = await supertest(app)
      .get(
        `/api/v1/reserve?_id_user=${userId}&_id_car=${carId}&start_date=07/08/2015&end_date=10/08/2015`,
      )
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.reserves).toBeInstanceOf(Array);
    expect(response.body.reserves.length).toBeGreaterThan(0);
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('offset');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('offsets');

    response.body.reserves.forEach((reserve: IReserve) => {
      expect(reserve).toHaveProperty('_id');
      expect(reserve).toHaveProperty('_id_user', userId);
      expect(reserve).toHaveProperty('_id_car', carId);
      expect(reserve).toHaveProperty('start_date', reserveData.start_date);
      expect(reserve).toHaveProperty('end_date', reserveData.end_date);
    });

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should be able to list reserves', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveDelete);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveDelete.email,
      password: userReserveDelete.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveDelete)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const reserveData = {
      _id_user: userId,
      _id_car: carId,
      start_date: '07/08/2015',
      end_date: '10/08/2015',
    };

    const reserveData2 = {
      _id_user: userId,
      _id_car: carId,
      start_date: '12/09/2015',
      end_date: '14/09/2015',
    };

    await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData2)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(app)
      .get(`/api/v1/reserve`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.reserves).toBeInstanceOf(Array);
    expect(response.body.reserves.length).toBeGreaterThan(1);
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('offset');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('offsets');

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
