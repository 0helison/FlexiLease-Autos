import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import { Qualified } from '@modules/users/domain/enums/Qualified';
import CreateReserveService from '@modules/reserve/services/CreateReserveService';
import ReserveRepositoryInMemory from '@modules/reserve/infra/typeorm/repositories/inMemory/ReserveRepositoryInMemory';
import CarRepositoryInMemory from '@modules/cars/infra/typeorm/repositories/inMemory/CarRepositoryInMemory';
import UserRepositoryInMemory from '@modules/users/infra/typeorm/repositories/inMemory/UserRepositoryInMemory';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { BusinessError } from '@shared/errors/BusinessError';
import {
  CAR_NOT_FOUND,
  USER_NOT_FOUND,
  UNQUALIFIED_USER,
  CAR_ALREADY_RESERVED_SAME_DAY,
  USER_ALREADY_HAS_RESERVATION_IN_DATE,
} from '@shared/consts/ErrorMessagesConsts';

describe('CreateReserve', () => {
  let reserveRepositoryInMemory: ReserveRepositoryInMemory;
  let carRepositoryInMemory: CarRepositoryInMemory;
  let userRepositoryInMemory: UserRepositoryInMemory;
  let createReserveService: CreateReserveService;

  beforeEach(() => {
    reserveRepositoryInMemory = new ReserveRepositoryInMemory();
    carRepositoryInMemory = new CarRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    createReserveService = new CreateReserveService(
      reserveRepositoryInMemory,
      userRepositoryInMemory,
      carRepositoryInMemory,
    );
  });

  it('should be able to create a new reserve', async () => {
    const userData = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e1'),
      name: 'Maria',
      cpf: '111.000.111-11',
      birthday: new Date('2000-08-17'),
      email: 'maria@gmail.com',
      password: '123456',
      qualified: 'yes' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };

    const carData = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e2'),
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

    await userRepositoryInMemory.create(userData);
    await carRepositoryInMemory.create(carData);

    const reserveData = {
      _id_user: userData._id,
      _id_car: carData._id,
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
    };

    const reserve = await createReserveService.execute(reserveData);

    expect(reserve).toHaveProperty('_id');
    expect(reserve._id_user).toEqual(reserveData._id_user);
    expect(reserve._id_car).toEqual(reserveData._id_car);
    expect(reserve.start_date.toISOString()).toBe(
      reserveData.start_date.toISOString(),
    );
    expect(reserve.end_date.toISOString()).toBe(
      reserveData.end_date.toISOString(),
    );
    expect(reserve.final_value).toBe(750);
  });

  it('should not be able to create a new reserve with non-existent user', async () => {
    const carData = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e2'),
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

    await carRepositoryInMemory.create(carData);

    const reserveData = {
      _id_user: new ObjectId(),
      _id_car: carData._id,
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
    };

    await expect(createReserveService.execute(reserveData)).rejects.toThrow(
      NotFoundError,
    );
    await expect(createReserveService.execute(reserveData)).rejects.toThrow(
      USER_NOT_FOUND,
    );
  });

  it('should not be able to create a new reserve with non-existent car', async () => {
    const userData = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e1'),
      name: 'Maria',
      cpf: '111.000.111-11',
      birthday: new Date('2000-08-17'),
      email: 'maria@gmail.com',
      password: '123456',
      qualified: 'yes' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };

    await userRepositoryInMemory.create(userData);

    const reserveData = {
      _id_user: userData._id,
      _id_car: new ObjectId(),
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
    };

    await expect(createReserveService.execute(reserveData)).rejects.toThrow(
      NotFoundError,
    );
    await expect(createReserveService.execute(reserveData)).rejects.toThrow(
      CAR_NOT_FOUND,
    );
  });

  it('should not be able to create a new reserve with unqualified user', async () => {
    const userData = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e1'),
      name: 'Carlos',
      cpf: '222.000.222-22',
      birthday: new Date('2000-08-17'),
      email: 'carlos@gmail.com',
      password: '123456',
      qualified: 'no' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };

    const carData = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e2'),
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

    await userRepositoryInMemory.create(userData);
    await carRepositoryInMemory.create(carData);

    const reserveData = {
      _id_user: userData._id,
      _id_car: carData._id,
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
    };

    await expect(createReserveService.execute(reserveData)).rejects.toThrow(
      BusinessError,
    );
    await expect(createReserveService.execute(reserveData)).rejects.toThrow(
      UNQUALIFIED_USER,
    );
  });

  it('should not be able to create a reserve for the same car on the same day', async () => {
    const userData = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e1'),
      name: 'Maria',
      cpf: '111.000.111-11',
      birthday: new Date('2000-08-17'),
      email: 'maria@gmail.com',
      password: '123456',
      qualified: 'yes' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };

    const carData = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e2'),
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

    await userRepositoryInMemory.create(userData);
    await carRepositoryInMemory.create(carData);

    const reserveData = {
      _id_user: userData._id,
      _id_car: carData._id,
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
    };

    await createReserveService.execute(reserveData);

    await expect(createReserveService.execute(reserveData)).rejects.toThrow(
      BusinessError,
    );
    await expect(createReserveService.execute(reserveData)).rejects.toThrow(
      CAR_ALREADY_RESERVED_SAME_DAY,
    );
  });

  it('Should not be able to create a new reserve for user already has a reservation on that date', async () => {
    const userData = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e1'),
      name: 'Maria',
      cpf: '111.000.111-11',
      birthday: new Date('2000-08-17'),
      email: 'maria@gmail.com',
      password: '123456',
      qualified: 'yes' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };

    const carData1 = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e2'),
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

    const carData2 = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e3'),
      model: 'Ka',
      color: 'Red',
      year: '2021',
      value_per_day: 140,
      number_of_passengers: 5,
      accessories: [
        { _id: new ObjectId(), description: 'GPS' },
        { _id: new ObjectId(), description: 'Airbag' },
      ],
    };

    await userRepositoryInMemory.create(userData);
    await carRepositoryInMemory.create(carData1);
    await carRepositoryInMemory.create(carData2);

    const reserveData1 = {
      _id_user: userData._id,
      _id_car: carData1._id,
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
    };

    const reserveData2 = {
      _id_user: userData._id,
      _id_car: carData2._id,
      start_date: new Date('2024-08-02'),
      end_date: new Date('2024-08-04'),
    };

    await createReserveService.execute(reserveData1);

    await expect(createReserveService.execute(reserveData2)).rejects.toThrow(
      BusinessError,
    );
    await expect(createReserveService.execute(reserveData2)).rejects.toThrow(
      USER_ALREADY_HAS_RESERVATION_IN_DATE,
    );
  });
});
