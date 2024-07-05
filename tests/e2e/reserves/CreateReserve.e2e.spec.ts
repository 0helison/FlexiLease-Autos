import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import {
  CAR_ALREADY_RESERVED_SAME_DAY,
  CAR_NOT_FOUND,
  DATE_ORDER_INVALID,
  UNQUALIFIED_USER,
  USER_ALREADY_HAS_RESERVATION_IN_DATE,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorMessagesConsts';
import { BAD_REQUEST, NOT_FOUND } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import DeleteReserveService from '@modules/reserve/services/DeleteReserveService';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('CreateReserve', () => {
  let deleteReserveService: DeleteReserveService;

  let token: string;
  let userId: string;
  let userId2: string;
  let carId: string;
  let reserveId: string;

  const userReserveCreate = {
    name: 'User Reserve Create',
    cpf: '220.220.200-11',
    birthday: '12/05/2000',
    email: 'user_reserve_create@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userReserveCreate2 = {
    name: 'User Reserve Create 2',
    cpf: '221.221.221-22',
    birthday: '12/05/2000',
    email: 'user_reserve_create2@mail.com',
    password: '123456',
    qualified: 'no',
    cep: '58340-000',
  };

  const userReserveCreate3 = {
    name: 'User Reserve Create 3',
    cpf: '223.223.223-33',
    birthday: '12/05/2000',
    email: 'user_reserve_create3@mail.com',
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

  const nonExistentUserError = {
    code: HttpStatusCode.NOT_FOUND,
    status: NOT_FOUND,
    message: USER_NOT_FOUND,
    details: [],
  };

  const errorUnqualifiedUser = {
    code: HttpStatusCode.BAD_REQUEST,
    status: BAD_REQUEST,
    message: UNQUALIFIED_USER,
    details: [],
  };

  const nonExistentCarError = {
    code: HttpStatusCode.NOT_FOUND,
    status: NOT_FOUND,
    message: CAR_NOT_FOUND,
    details: [],
  };

  const invalidOrderDate = {
    code: HttpStatusCode.BAD_REQUEST,
    status: BAD_REQUEST,
    message: DATE_ORDER_INVALID,
    details: [],
  };

  const carAlreadyReservedSameDay = {
    code: HttpStatusCode.BAD_REQUEST,
    status: BAD_REQUEST,
    message: CAR_ALREADY_RESERVED_SAME_DAY,
    details: [],
  };

  const userAlreadyHasReservationInDate = {
    code: HttpStatusCode.BAD_REQUEST,
    status: BAD_REQUEST,
    message: USER_ALREADY_HAS_RESERVATION_IN_DATE,
    details: [],
  };

  beforeEach(() => {
    deleteReserveService = container.resolve(DeleteReserveService);
  });

  it('Should be able to create a new reserve', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveCreate);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveCreate.email,
      password: userReserveCreate.password,
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

    const response = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    reserveId = response.body._id;

    expect(response.status).toBe(HttpStatusCode.CREATED);
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

  it('Should not be able to create a new reserve with non-existent user', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveCreate);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveCreate.email,
      password: userReserveCreate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveDelete)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const reserveData = {
      _id_user: '6682b4ea7372a45569e12f17',
      _id_car: carId,
      start_date: '07/08/2015',
      end_date: '10/08/2015',
    };

    const response = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentUserError);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to create a new reserve with user unqualified', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveCreate2);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveCreate2.email,
      password: userReserveCreate2.password,
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

    const response = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(errorUnqualifiedUser);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to create a new reserve with non-existent car', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveCreate);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveCreate.email,
      password: userReserveCreate.password,
    });

    token = auth.body.token;

    const reserveData = {
      _id_user: userId,
      _id_car: '6682b4ea7372a45569e12f17',
      start_date: '07/08/2015',
      end_date: '10/08/2015',
    };

    const response = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentCarError);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to create a new reserve with invalid order date', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveCreate);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveCreate.email,
      password: userReserveCreate.password,
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
      end_date: '01/08/2015',
    };

    const response = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    reserveId = response.body._id;

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(invalidOrderDate);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to create a new reserve with car already reserved in same day', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveCreate);

    userId = user.body._id;

    const user2 = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveCreate3);

    userId2 = user2.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveCreate.email,
      password: userReserveCreate.password,
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

    await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    const reserveData2 = {
      _id_user: userId2,
      _id_car: carId,
      start_date: '07/08/2015',
      end_date: '20/08/2015',
    };

    const response = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(carAlreadyReservedSameDay);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    await supertest(app)
      .delete(`/api/v1/user/${userId2}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to create a new reserve for user already has a reservation on that date', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveCreate);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveCreate.email,
      password: userReserveCreate.password,
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
      start_date: '05/08/2015',
      end_date: '10/08/2015',
    };

    await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    const reserveData2 = {
      _id_user: userId,
      _id_car: carId,
      start_date: '06/08/2015',
      end_date: '09/08/2015',
    };

    const response = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(userAlreadyHasReservationInDate);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    await supertest(app)
      .delete(`/api/v1/user/${userId2}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
