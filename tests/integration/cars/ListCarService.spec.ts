import 'reflect-metadata';
import { IPaginateCar } from '@modules/cars/domain/models/IPaginateCar';
import { ISearchParamsList } from '@modules/cars/domain/models/ISearchParamsList';
import CarRepositoryInMemory from '@modules/cars/infra/typeorm/repositories/inMemory/CarRepositoryInMemory';
import ListCarService from '@modules/cars/services/ListCarService';
import { ObjectId } from 'mongodb';

describe('ListCarService', () => {
  let carRepositoryInMemory: CarRepositoryInMemory;
  let listCarService: ListCarService;

  beforeEach(() => {
    carRepositoryInMemory = new CarRepositoryInMemory();
    listCarService = new ListCarService(carRepositoryInMemory);
  });

  it('should be able to list all cars without filter', async () => {
    const carsData = [
      {
        model: 'Polo',
        color: 'Red',
        year: '2021',
        value_per_day: 500,
        number_of_passengers: 7,
        accessories: [
          { _id: new ObjectId(), description: 'GPS' },
          { _id: new ObjectId(), description: 'Airbag' },
        ],
      },
      {
        model: 'Fox',
        color: 'Blue',
        year: '2022',
        value_per_day: 150,
        number_of_passengers: 5,
        accessories: [
          { _id: new ObjectId(), description: 'GPS' },
          { _id: new ObjectId(), description: 'Airbag' },
        ],
      },
    ];

    await Promise.all(
      carsData.map(carData => carRepositoryInMemory.create(carData)),
    );

    const params: ISearchParamsList = {
      limit: 10,
      offset: 0,
    };

    const result: IPaginateCar = await listCarService.execute(params);

    expect(result.cars).toHaveLength(2);
  });

  it('should be able to list cars with pagination', async () => {
    const carsData = [
      {
        model: 'Kwid',
        color: 'Black',
        year: '2021',
        value_per_day: 180,
        number_of_passengers: 4,
        accessories: [
          { _id: new ObjectId(), description: 'GPS' },
          { _id: new ObjectId(), description: 'Airbag' },
        ],
      },
      {
        model: 'BMW X6',
        color: 'Silver',
        year: '2022',
        value_per_day: 5000,
        number_of_passengers: 5,
        accessories: [
          { _id: new ObjectId(), description: 'GPS' },
          { _id: new ObjectId(), description: 'Airbag' },
        ],
      },
    ];

    await Promise.all(
      carsData.map(carData => carRepositoryInMemory.create(carData)),
    );

    const params: ISearchParamsList = {
      limit: 1,
      offset: 0,
    };

    const result1: IPaginateCar = await listCarService.execute(params);

    expect(result1.cars).toHaveLength(1);
    expect(result1.total).toBe(2);

    params.offset = 1;
    const result2: IPaginateCar = await listCarService.execute(params);

    expect(result2.cars).toHaveLength(1);
    expect(result2.offset).toBe(1);
  });
});
