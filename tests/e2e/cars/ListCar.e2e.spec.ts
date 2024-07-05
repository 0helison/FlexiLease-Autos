import 'reflect-metadata';
import supertest from 'supertest';
import { app } from '@shared/infra/http/app';
import { dataSource } from '@shared/infra/typeorm';
import { container } from 'tsyringe';
import { HttpStatusCode } from '@shared/enums/HttpStatusCode';
import { ICar } from '@modules/cars/domain/models/ICar';
import ListCarService from '@modules/cars/services/ListCarService';

beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('ListCar', () => {
  let listCarService: ListCarService;

  const userCarList = {
    name: 'User Car List',
    cpf: '112.112.112-11',
    birthday: '12/05/2000',
    email: 'user_car_list@mail.com',
    password: '123456',
    qualified: 'yes',
    cep: '58340-000',
  };

  const carList = {
    model: 'Corolla',
    color: 'white',
    year: '2019',
    value_per_day: 300,
    number_of_passengers: 5,
    accessories: [
      {
        description: 'Airbag',
      },
      {
        description: 'Gps',
      },
    ],
  };

  const carList2 = {
    model: 'Uno',
    color: 'white',
    year: '1990',
    value_per_day: 100,
    number_of_passengers: 4,
    accessories: [
      {
        description: 'led',
      },
      {
        description: 'liga-leve',
      },
    ],
  };

  let token: string;

  beforeEach(() => {
    listCarService = container.resolve(ListCarService);
  });

  it('Should be able to list cars with query', async () => {
    const user = await supertest(app).post('/api/v1/user').send(userCarList);

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userCarList.email,
      password: userCarList.password,
    });

    token = authResponse.body.token;

    await supertest(app)
      .post('/api/v1/car')
      .send(carList)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(app)
      .get(
        '/api/v1/car?model=Corolla&color=white&year=2019&value_per_day=300&number_of_passengers=5&accessories.description=Airbag',
      )
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.cars).toBeInstanceOf(Array);
    expect(response.body.cars.length).toBeGreaterThan(0);
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('offset');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('offsets');

    response.body.cars.forEach((car: ICar) => {
      expect(car).toHaveProperty('_id');
      expect(car).toHaveProperty('model', carList.model);
      expect(car).toHaveProperty('color', carList.color);
      expect(car).toHaveProperty('year', carList.year);
      expect(car).toHaveProperty('value_per_day', carList.value_per_day);
      expect(car).toHaveProperty(
        'number_of_passengers',
        carList.number_of_passengers,
      );
      const accessoryDescriptions = car.accessories.map(acc => acc.description);
      expect(accessoryDescriptions).toContain('Airbag');
    });

    await supertest(app)
      .delete(`/api/v1/user/${user.body._id}`)
      .set('Authorization', `Bearer ${token}`);
  });
  it('Should be able to list cars', async () => {
    const userResponse = await supertest(app)
      .post('/api/v1/user')
      .send(userCarList);

    const authResponse = await supertest(app).post('/api/v1/auth').send({
      email: userCarList.email,
      password: userCarList.password,
    });

    token = authResponse.body.token;

    await supertest(app)
      .post('/api/v1/car')
      .send(carList2)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(app)
      .get('/api/v1/car')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body.cars).toBeInstanceOf(Array);
    expect(response.body.cars.length).toBeGreaterThan(1);
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('offset');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('offsets');
  });
});
