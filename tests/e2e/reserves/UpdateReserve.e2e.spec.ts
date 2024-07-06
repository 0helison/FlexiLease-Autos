import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import {
  CAR_ALREADY_RESERVED_SAME_DAY,
  CAR_NOT_FOUND,
  DATE_ORDER_INVALID,
  RESERVE_NOT_FOUND,
  UNQUALIFIED_USER,
  USER_ALREADY_HAS_RESERVATION_IN_DATE,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorMessagesConsts';
import { BAD_REQUEST, NOT_FOUND } from '@shared/consts/ErrorsConsts';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import UpdateReserveService from '@modules/reserve/services/UpdateReserveService';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('UpdateReserve', () => {
  let updateReserveService: UpdateReserveService;

  let token: string;
  let userId: string;
  let userId2: string;
  let carId: string;
  let carId2: string;
  let reserveId: string;

  const userReserveUpdate = {
    name: 'User Reserve Update',
    cpf: '227.227.777-11',
    birthday: '12/05/2000',
    email: 'user_reserve_update@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userReserveUpdate2 = {
    name: 'User Reserve Update 2',
    cpf: '228.228.777-22',
    birthday: '12/05/2000',
    email: 'user_reserve_update2@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const userReserveUpdate3 = {
    name: 'User Reserve Update 3',
    cpf: '229.229.888-33',
    birthday: '12/05/2000',
    email: 'user_reserve_update3@mail.com',
    password: '123456',
    qualified: 'no',
    cep: '58340-000',
  };

  const carReserveUpdate = {
    model: 'Gol G5',
    color: 'white',
    year: '2020',
    value_per_day: 100,
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

  const carReserveUpdate2 = {
    model: 'Polo',
    color: 'white',
    year: '2022',
    value_per_day: 300,
    number_of_passengers: 3,
    accessories: [
      {
        description: 'airbag',
      },
      {
        description: 'para-brisa',
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

  const nonExistentReserveError = {
    code: HttpStatusCode.NOT_FOUND,
    status: NOT_FOUND,
    message: RESERVE_NOT_FOUND,
    details: [],
  };

  beforeEach(() => {
    updateReserveService = container.resolve(UpdateReserveService);
  });

  it('Should be able to update all reserve', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveUpdate);

    userId = user.body._id;

    const user2 = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveUpdate2);

    userId2 = user2.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveUpdate.email,
      password: userReserveUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const car2 = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveUpdate2)
      .set('Authorization', `Bearer ${token}`);

    carId2 = car2.body._id;

    const reserveData = {
      _id_user: userId,
      _id_car: carId,
      start_date: '01/08/2015',
      end_date: '05/08/2015',
    };

    const reserveData2 = {
      _id_user: userId2,
      _id_car: carId2,
      start_date: '08/08/2015',
      end_date: '11/08/2015',
    };

    const createdReserve = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    reserveId = createdReserve.body._id;

    const response = await supertest(app)
      .put(`/api/v1/reserve/${reserveId}`)
      .send(reserveData2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body._id_user).toBe(reserveData2._id_user);
    expect(response.body._id_car).toBe(reserveData2._id_car);
    expect(response.body.start_date).toBe(reserveData2.start_date);
    expect(response.body.end_date).toBe(reserveData2.end_date);
    expect(response.body).toHaveProperty('final_value', 1200);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    await supertest(app)
      .delete(`/api/v1/user/${userId2}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be possible to update a non-existent reserve', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveUpdate);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveUpdate.email,
      password: userReserveUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const reserveData = {
      _id_user: userId,
      _id_car: carId,
      start_date: '01/08/2015',
      end_date: '05/08/2015',
    };

    await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(app)
      .put(`/api/v1/reserve/6682b4ea7372a45569e12f14`)
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentReserveError);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to update reserve with user non-existent', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveUpdate);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveUpdate.email,
      password: userReserveUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const reserveData = {
      _id_user: userId,
      _id_car: carId,
      start_date: '01/08/2015',
      end_date: '05/08/2015',
    };

    const reserveData2 = {
      _id_user: '6682b4ea7372a45569e12f14',
      _id_car: carId,
      start_date: '08/08/2015',
      end_date: '11/08/2015',
    };

    const createdReserve = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    reserveId = createdReserve.body._id;

    const response = await supertest(app)
      .put(`/api/v1/reserve/${reserveId}`)
      .send(reserveData2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentUserError);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to update reserve with user non-existent', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveUpdate);

    userId = user.body._id;

    const user2 = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveUpdate3);

    userId2 = user2.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveUpdate.email,
      password: userReserveUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const reserveData = {
      _id_user: userId,
      _id_car: carId,
      start_date: '01/08/2015',
      end_date: '05/08/2015',
    };

    const reserveData2 = {
      _id_user: userId2,
      _id_car: carId,
      start_date: '08/08/2015',
      end_date: '11/08/2015',
    };

    const createdReserve = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    reserveId = createdReserve.body._id;

    const response = await supertest(app)
      .put(`/api/v1/reserve/${reserveId}`)
      .send(reserveData2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(errorUnqualifiedUser);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    await supertest(app)
      .delete(`/api/v1/user/${userId2}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to update reserve with car non-existent', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveUpdate);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveUpdate.email,
      password: userReserveUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const reserveData = {
      _id_user: userId,
      _id_car: carId,
      start_date: '01/08/2015',
      end_date: '05/08/2015',
    };

    const reserveData2 = {
      _id_user: userId,
      _id_car: '6682b4ea7372a45569e12f14',
      start_date: '08/08/2015',
      end_date: '11/08/2015',
    };

    const createdReserve = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    reserveId = createdReserve.body._id;

    const response = await supertest(app)
      .put(`/api/v1/reserve/${reserveId}`)
      .send(reserveData2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentCarError);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to update reserve with invalid order date', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveUpdate);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveUpdate.email,
      password: userReserveUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const reserveData = {
      _id_user: userId,
      _id_car: carId,
      start_date: '01/08/2015',
      end_date: '05/08/2015',
    };

    const reserveData2 = {
      _id_user: userId,
      _id_car: carId,
      start_date: '12/08/2015',
      end_date: '11/08/2015',
    };

    const createdReserve = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    reserveId = createdReserve.body._id;

    const response = await supertest(app)
      .put(`/api/v1/reserve/${reserveId}`)
      .send(reserveData2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(invalidOrderDate);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to create a new reserve with car already reserved in same day', async () => {
    const user = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveUpdate);

    userId = user.body._id;

    const user2 = await supertest(app)
      .post('/api/v1/user')
      .send(userReserveUpdate2);

    userId2 = user2.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveUpdate.email,
      password: userReserveUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const reserveData = {
      _id_user: userId,
      _id_car: carId,
      start_date: '03/08/2015',
      end_date: '05/08/2015',
    };

    const reserveData2 = {
      _id_user: userId2,
      _id_car: carId,
      start_date: '03/08/2015',
      end_date: '11/08/2015',
    };

    const createdReserve = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    reserveId = createdReserve.body._id;

    const response = await supertest(app)
      .put(`/api/v1/reserve/${reserveId}`)
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
      .send(userReserveUpdate);

    userId = user.body._id;

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userReserveUpdate.email,
      password: userReserveUpdate.password,
    });

    token = auth.body.token;

    const car = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveUpdate)
      .set('Authorization', `Bearer ${token}`);

    carId = car.body._id;

    const car2 = await supertest(app)
      .post('/api/v1/car')
      .send(carReserveUpdate2)
      .set('Authorization', `Bearer ${token}`);

    carId2 = car2.body._id;

    const reserveData = {
      _id_user: userId,
      _id_car: carId,
      start_date: '01/08/2015',
      end_date: '10/08/2015',
    };

    const reserveData2 = {
      _id_user: userId,
      _id_car: carId2,
      start_date: '03/08/2015',
      end_date: '07/08/2015',
    };

    const createdReserve = await supertest(app)
      .post('/api/v1/reserve')
      .send(reserveData)
      .set('Authorization', `Bearer ${token}`);

    reserveId = createdReserve.body._id;

    const response = await supertest(app)
      .put(`/api/v1/reserve/${reserveId}`)
      .send(reserveData2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(userAlreadyHasReservationInDate);

    await supertest(app)
      .delete(`/api/v1/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
