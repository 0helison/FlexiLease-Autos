import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import { RESERVE_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import { NOT_FOUND } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import DeleteReserveService from '@modules/reserve/services/DeleteReserveService';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('ShowReserve', () => {
  let deleteReserveService: DeleteReserveService;

  let token: string;
  let userId: string;
  let carId: string;
  let reserveId: string;

  const userReserveDelete = {
    name: 'User Reserve Show',
    cpf: '214.214.444-22',
    birthday: '12/05/2000',
    email: 'user_reserve_delete@mail.com',
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

  const nonExistentReserveError = {
    code: HttpStatusCode.NOT_FOUND,
    status: NOT_FOUND,
    message: RESERVE_NOT_FOUND,
    details: [],
  };

  beforeEach(() => {
    deleteReserveService = container.resolve(DeleteReserveService);
  });

  it('Should be able to show a reserve by ID', async () => {
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
      .get(`/api/v1/reserve/${reserveId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toHaveProperty('_id', reserveId);
    expect(response.body).toHaveProperty('_id_user', userId);
    expect(response.body).toHaveProperty('_id_car', carId);
    expect(response.body).toHaveProperty('start_date', reserveData.start_date);
    expect(response.body).toHaveProperty('end_date', reserveData.end_date);
    expect(response.body).toHaveProperty('final_value');

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be possible to show a non-existent reserve', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveDelete);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveDelete.email,
      password: userReserveDelete.password,
    });

    token = auth.body.token;

    const response = await supertest(app)
      .get(`/api/v1/reserve/6682b4ea7372a45569e12f14`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentReserveError);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
