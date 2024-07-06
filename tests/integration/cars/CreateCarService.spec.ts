import 'reflect-metadata';
import CarRepositoryInMemory from '@modules/cars/infra/typeorm/repositories/inMemory/CarRepositoryInMemory';
import CreateCarService from '@modules/cars/services/CreateCarService';
import { ObjectId } from 'mongodb';

describe('CreateCarService', () => {
  let carRepositoryInMemory: CarRepositoryInMemory;
  let createCarService: CreateCarService;

  beforeEach(() => {
    carRepositoryInMemory = new CarRepositoryInMemory();
    createCarService = new CreateCarService(carRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const carData = {
      model: 'Gol G6',
      color: 'Blue',
      year: '2022',
      value_per_day: 150,
      number_of_passengers: 5,
      accessories: [
        { _id: new ObjectId(), description: 'GPS' },
        { _id: new ObjectId(), description: 'Airbag' },
      ],
    };

    const createdCar = await createCarService.execute(carData);

    expect(createdCar).toHaveProperty('_id');
    expect(createdCar.model).toBe(carData.model);
    expect(createdCar.color).toBe(carData.color);
    expect(createdCar.year).toBe(carData.year);
    expect(createdCar.value_per_day).toBe(carData.value_per_day);
    expect(createdCar.number_of_passengers).toBe(carData.number_of_passengers);
    expect(createdCar.accessories).toHaveLength(carData.accessories.length);

    const retrievedCar = await carRepositoryInMemory.findById(createdCar._id);
    expect(retrievedCar).toMatchObject(createdCar);
  });
});
