import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import CarRepositoryInMemory from '@modules/cars/infra/typeorm/repositories/inMemory/CarRepositoryInMemory';
import ShowCarService from '@modules/cars/services/ShowCarService';

describe('ShowCarService', () => {
  let carRepositoryInMemory: CarRepositoryInMemory;
  let showCarService: ShowCarService;

  beforeEach(() => {
    carRepositoryInMemory = new CarRepositoryInMemory();
    showCarService = new ShowCarService(carRepositoryInMemory);
  });

  it('should be able to show a car by id', async () => {
    const carData = {
      model: 'Mobi',
      color: 'Red',
      year: '2021',
      value_per_day: 200,
      number_of_passengers: 4,
      accessories: [
        { _id: new ObjectId(), description: 'GPS' },
        { _id: new ObjectId(), description: 'Airbag' },
      ],
    };

    const createdCar = await carRepositoryInMemory.create(carData);

    const foundCar = await showCarService.execute({ _id: createdCar._id });

    expect(foundCar).toEqual(createdCar);
  });

  it('should not be able to show a non-existent car', async () => {
    const nonExistentCarId = new ObjectId();

    await expect(
      showCarService.execute({ _id: nonExistentCarId }),
    ).rejects.toThrow(NotFoundError);
    await expect(
      showCarService.execute({ _id: nonExistentCarId }),
    ).rejects.toThrow(CAR_NOT_FOUND);
  });
});
