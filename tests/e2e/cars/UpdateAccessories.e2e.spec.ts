import 'reflect-metadata';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { dataSource } from '@shared/infra/typeorm';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import UpdateAccessoryService from '@modules/cars/services/UpdateAccessoriesService';
import {
  CAR_NOT_FOUND,
  NON_REPEAT_ACCESSORIES,
} from '@shared/consts/ErrorMessagesConsts';
import { BAD_REQUEST, NOT_FOUND } from '@shared/consts/ErrorsConsts';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('UpdateAccessories', () => {
  let updateAccessoryService: UpdateAccessoryService;
  let token: string;
  let carId: string;
  let accessoryId: string;

  const userAccessoryUpdate = {
    name: 'User Car Update Accessory',
    cpf: '333.110.333-11',
    birthday: '17/08/2000',
    email: 'user_accessory_update@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const carUpdateAccessory = {
    model: 'Gol G5',
    color: 'white',
    year: '2022',
    value_per_day: 100,
    number_of_passengers: 3,
    accessories: [
      {
        description: 'gps',
      },
    ],
  };

  const carUpdateAccessory2 = {
    model: 'Gol G5',
    color: 'white',
    year: '2022',
    value_per_day: 100,
    number_of_passengers: 3,
    accessories: [
      {
        description: 'gps',
      },
      {
        description: 'led',
      },
    ],
  };

  const accessoryUpdate = {
    description: 'led',
  };

  const accessoryUpdate2 = {
    description: 'led',
  };

  const errorRepetingAccessory = {
    code: HttpStatusCode.BAD_REQUEST,
    status: BAD_REQUEST,
    message: NON_REPEAT_ACCESSORIES,
    details: [],
  };

  const nonExistentCarError = {
    code: HttpStatusCode.NOT_FOUND,
    status: NOT_FOUND,
    message: CAR_NOT_FOUND,
    details: [],
  };

  beforeEach(() => {
    updateAccessoryService = container.resolve(UpdateAccessoryService);
  });

  it('Should be able to update an accessory by id', async () => {
    const userResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userAccessoryUpdate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userAccessoryUpdate.email,
      password: userAccessoryUpdate.password,
    });

    token = auth.body.token;

    const carResponse = await supertest(app)
      .post('/api/v1/car')
      .send(carUpdateAccessory)
      .set('Authorization', `Bearer ${token}`);

    carId = carResponse.body._id;
    accessoryId = carResponse.body.accessories[0]._id;

    const response = await supertest(app)
      .patch(`/api/v1/car/${carId}/accessories/${accessoryId}`)
      .send(accessoryUpdate)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);

    await supertest(app)
      .delete(`/api/v1/user/${userResponse.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should be able to create a new description if you cannot find the id', async () => {
    const userResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userAccessoryUpdate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userAccessoryUpdate.email,
      password: userAccessoryUpdate.password,
    });

    token = auth.body.token;

    const carResponse = await supertest(app)
      .post('/api/v1/car')
      .send(carUpdateAccessory)
      .set('Authorization', `Bearer ${token}`);

    carId = carResponse.body._id;

    const response = await supertest(app)
      .patch(`/api/v1/car/${carId}/accessories/6682b4ea7372a45569e12f17`)
      .send(accessoryUpdate)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);

    await supertest(app)
      .delete(`/api/v1/user/${userResponse.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be able to update a description if it is repeated', async () => {
    const userResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userAccessoryUpdate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userAccessoryUpdate.email,
      password: userAccessoryUpdate.password,
    });

    token = auth.body.token;

    const carResponse = await supertest(app)
      .post('/api/v1/car')
      .send(carUpdateAccessory2)
      .set('Authorization', `Bearer ${token}`);

    carId = carResponse.body._id;
    accessoryId = carResponse.body.accessories[0]._id;

    const response = await supertest(app)
      .patch(`/api/v1/car/${carId}/accessories/${accessoryId}`)
      .send(accessoryUpdate2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
    expect(response.body).toEqual(errorRepetingAccessory);

    await supertest(app)
      .delete(`/api/v1/user/${userResponse.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('Should not be possible to update accessory a non-existent car', async () => {
    const userResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userAccessoryUpdate);

    const auth = await supertest(app).post('/api/v1/auth').send({
      email: userAccessoryUpdate.email,
      password: userAccessoryUpdate.password,
    });

    token = auth.body.token;

    const response = await supertest(app)
      .patch(
        `/api/v1/car/6682b4ea7372a45569e12f17/accessories/6682b4ea7372a45569e12f17`,
      )
      .send(accessoryUpdate2)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
    expect(response.body).toEqual(nonExistentCarError);

    await supertest(app)
      .delete(`/api/v1/user/${userResponse.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
