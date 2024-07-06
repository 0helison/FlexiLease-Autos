import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import CarRepositoryInMemory from '@modules/cars/infra/typeorm/repositories/inMemory/CarRepositoryInMemory';
import { NotFoundError } from '@shared/errors/NotFoundError';
import {
  CAR_NOT_FOUND,
  NON_REPEAT_ACCESSORIES,
} from '@shared/consts/ErrorMessagesConsts';
import UpdateAccessoryService from '@modules/cars/services/UpdateAccessoriesService';

describe('UpdateAccessoryService', () => {
  let carRepositoryInMemory: CarRepositoryInMemory;
  let updateAccessoryService: UpdateAccessoryService;

  beforeEach(() => {
    carRepositoryInMemory = new CarRepositoryInMemory();
    updateAccessoryService = new UpdateAccessoryService(carRepositoryInMemory);
  });

  it('should update an existing accessory in a car', async () => {
    const carData = {
      _id: new ObjectId(),
      model: 'Golf Sport',
      color: 'Red',
      year: '2022',
      value_per_day: 900,
      number_of_passengers: 4,
      accessories: [
        { _id: new ObjectId(), description: 'GPS' },
        { _id: new ObjectId(), description: 'Airbag' },
      ],
    };

    await carRepositoryInMemory.create(carData);

    const updatedAccessoryData = {
      _id: carData._id,
      _id_accessory: carData.accessories[0]._id,
      description: 'Led',
    };

    const updatedCar =
      await updateAccessoryService.execute(updatedAccessoryData);

    expect(updatedCar.accessories).toHaveLength(2);
    const updatedAccessory = updatedCar.accessories.find(acc =>
      acc._id.equals(updatedAccessoryData._id_accessory),
    );
    expect(updatedAccessory).toBeDefined();
    expect(updatedAccessory!.description).toEqual(
      updatedAccessoryData.description,
    );
  });

  it('should add a new accessory to a car if _id_accessory is not found', async () => {
    const carData = {
      _id: new ObjectId(),
      model: 'Golf Sport',
      color: 'Red',
      year: '2022',
      value_per_day: 900,
      number_of_passengers: 4,
      accessories: [
        { _id: new ObjectId(), description: 'GPS' },
        { _id: new ObjectId(), description: 'Airbag' },
      ],
    };

    await carRepositoryInMemory.create(carData);

    const newAccessoryDescription = 'Led';

    const updatedAccessoryData = {
      _id: carData._id,
      _id_accessory: new ObjectId(),
      description: newAccessoryDescription,
    };

    const updatedCar =
      await updateAccessoryService.execute(updatedAccessoryData);

    expect(updatedCar.accessories).toHaveLength(3);
    const newAccessory = updatedCar.accessories.find(
      acc => acc.description === newAccessoryDescription,
    );
    expect(newAccessory).toBeDefined();
  });

  it('should not be able to update accessory in a non-existent car', async () => {
    const nonExistentCarId = new ObjectId();
    const accessoryId = new ObjectId();

    const updateData = {
      _id: nonExistentCarId,
      _id_accessory: accessoryId,
      description: 'Liga-leve',
    };

    await expect(updateAccessoryService.execute(updateData)).rejects.toThrow(
      NotFoundError,
    );
    await expect(updateAccessoryService.execute(updateData)).rejects.toThrow(
      CAR_NOT_FOUND,
    );
  });

  it('should not be able to update a duplicate accessory description', async () => {
    const carData = {
      _id: new ObjectId(),
      model: 'Golf Sport',
      color: 'Red',
      year: '2022',
      value_per_day: 900,
      number_of_passengers: 4,
      accessories: [
        { _id: new ObjectId(), description: 'GPS' },
        { _id: new ObjectId(), description: 'Airbag' },
      ],
    };

    await carRepositoryInMemory.create(carData);

    const updateData = {
      _id: carData._id,
      _id_accessory: carData.accessories[1]._id,
      description: 'GPS',
    };

    await expect(updateAccessoryService.execute(updateData)).rejects.toThrow(
      NON_REPEAT_ACCESSORIES,
    );
  });
});
