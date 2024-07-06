import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import CarRepositoryInMemory from '@modules/cars/infra/typeorm/repositories/inMemory/CarRepositoryInMemory';
import UpdateCarService from '@modules/cars/services/UpdateCarService';

describe('UpdateCarService', () => {
  let carRepositoryInMemory: CarRepositoryInMemory;
  let updateCarService: UpdateCarService;

  beforeEach(() => {
    carRepositoryInMemory = new CarRepositoryInMemory();
    updateCarService = new UpdateCarService(carRepositoryInMemory);
  });

  it('should be able to update a car', async () => {
    const carData = {
      model: 'Fiat Uno',
      color: 'Black',
      year: '2023',
      value_per_day: 200,
      number_of_passengers: 10,
      accessories: [
        { _id: new ObjectId(), description: 'GPS' },
        { _id: new ObjectId(), description: 'Airbag' },
      ],
    };

    const createdCar = await carRepositoryInMemory.create(carData);

    const updatedCarData = {
      _id: createdCar._id,
      model: 'Uno Way',
      color: 'White',
      year: '2019',
      value_per_day: 250,
      number_of_passengers: 5,
    };

    const updatedCar = await updateCarService.execute(updatedCarData);

    expect(updatedCar._id).toEqual(createdCar._id);
    expect(updatedCar.model).toEqual(updatedCarData.model);
    expect(updatedCar.color).toEqual(updatedCarData.color);
    expect(updatedCar.year).toEqual(updatedCarData.year);
    expect(updatedCar.value_per_day).toEqual(updatedCarData.value_per_day);
    expect(updatedCar.number_of_passengers).toEqual(
      updatedCarData.number_of_passengers,
    );
    expect(updatedCar.accessories).toEqual(carData.accessories);
  });

  it('should not be able to update a non-existent car', async () => {
    const nonExistentCarId = new ObjectId();

    const updatedCarData = {
      _id: nonExistentCarId,
      model: 'Uno Way',
      color: 'White',
      year: '2019',
      value_per_day: 250,
      number_of_passengers: 5,
    };

    await expect(updateCarService.execute(updatedCarData)).rejects.toThrow(
      NotFoundError,
    );
    await expect(updateCarService.execute(updatedCarData)).rejects.toThrow(
      CAR_NOT_FOUND,
    );
  });
});
