import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import DeleteCarService from '@modules/cars/services/DeleteCarService';
import CarRepositoryInMemory from '@modules/cars/infra/typeorm/repositories/inMemory/CarRepositoryInMemory';

describe('DeleteCarService', () => {
  let carRepositoryInMemory: CarRepositoryInMemory;
  let deleteCarService: DeleteCarService;

  beforeEach(() => {
    carRepositoryInMemory = new CarRepositoryInMemory();
    deleteCarService = new DeleteCarService(carRepositoryInMemory);
  });

  it('should be able to delete a car', async () => {
    const carData = {
      model: 'Golf Sport',
      color: 'Red',
      year: '2023',
      value_per_day: 900,
      number_of_passengers: 4,
      accessories: [
        { _id: new ObjectId(), description: 'GPS' },
        { _id: new ObjectId(), description: 'Airbag' },
      ],
    };

    const createdCar = await carRepositoryInMemory.create(carData);

    await deleteCarService.execute({ _id: createdCar._id });

    const deletedCar = await carRepositoryInMemory.findById(createdCar._id);
    expect(deletedCar).toBeNull();
  });

  it('should not be able to delete a non-existent car', async () => {
    const nonExistentCarId = new ObjectId();

    await expect(
      deleteCarService.execute({ _id: nonExistentCarId }),
    ).rejects.toThrow(NotFoundError);
    await expect(
      deleteCarService.execute({ _id: nonExistentCarId }),
    ).rejects.toThrow(CAR_NOT_FOUND);
  });
});
