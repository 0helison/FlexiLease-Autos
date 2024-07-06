import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import { Qualified } from '@modules/users/domain/enums/Qualified';
import UpdateReserveService from '@modules/reserve/services/UpdateReserveService';
import ReserveRepositoryInMemory from '@modules/reserve/infra/typeorm/repositories/inMemory/ReserveRepositoryInMemory';
import CarRepositoryInMemory from '@modules/cars/infra/typeorm/repositories/inMemory/CarRepositoryInMemory';
import UserRepositoryInMemory from '@modules/users/infra/typeorm/repositories/inMemory/UserRepositoryInMemory';
import {
  CAR_ALREADY_RESERVED_SAME_DAY,
  CAR_NOT_FOUND,
  RESERVE_NOT_FOUND,
  UNQUALIFIED_USER,
  USER_ALREADY_HAS_RESERVATION_IN_DATE,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorMessagesConsts';

describe('UpdateReserveService', () => {
  let reserveRepositoryInMemory: ReserveRepositoryInMemory;
  let carRepositoryInMemory: CarRepositoryInMemory;
  let userRepositoryInMemory: UserRepositoryInMemory;
  let updateReserveService: UpdateReserveService;

  beforeEach(() => {
    reserveRepositoryInMemory = new ReserveRepositoryInMemory();
    carRepositoryInMemory = new CarRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    updateReserveService = new UpdateReserveService(
      reserveRepositoryInMemory,
      userRepositoryInMemory,
      carRepositoryInMemory,
    );
  });

  it('should be able to update a reserve', async () => {
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

    const reserveData = {
      _id_user: userData._id,
      _id_car: carData._id,
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
    };

    const createdReserve = await reserveRepositoryInMemory.create(reserveData);

    const userData2 = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e3'),
      name: 'João',
      cpf: '111.000.111-22',
      birthday: new Date('2000-08-17'),
      email: 'joao@gmail.com',
      password: '123456',
      qualified: 'yes' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };

    const carData2 = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e4'),
      model: 'Golf',
      color: 'White',
      year: '2021',
      value_per_day: 250,
      number_of_passengers: 4,
      accessories: [
        { _id: new ObjectId(), description: 'Led' },
        { _id: new ObjectId(), description: 'Painel digital' },
      ],
    };

    const updatedReserveData = {
      _id: createdReserve._id,
      _id_user: userData2._id,
      _id_car: carData2._id,
      start_date: new Date('2024-09-02'),
      end_date: new Date('2024-09-06'),
    };

    await userRepositoryInMemory.create(userData2);
    await carRepositoryInMemory.create(carData2);

    const updatedReserve =
      await updateReserveService.execute(updatedReserveData);

    expect(updatedReserve).toHaveProperty('_id', updatedReserveData._id);
    expect(updatedReserve._id_user).toEqual(updatedReserveData._id_user);
    expect(updatedReserve._id_car).toEqual(updatedReserveData._id_car);
    expect(updatedReserve.start_date.toISOString()).toBe(
      updatedReserveData.start_date.toISOString(),
    );
    expect(updatedReserve.end_date.toISOString()).toBe(
      updatedReserveData.end_date.toISOString(),
    );
    expect(updatedReserve.final_value).toEqual(1250);
  });

  it('should not be able to update a reserve with a non-existent reserve', async () => {
    const user = {
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
    await userRepositoryInMemory.create(user);

    const car = {
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
    await carRepositoryInMemory.create(car);

    const nonExistentReserveId = new ObjectId();

    const updatedReserveData = {
      _id: nonExistentReserveId,
      _id_user: user._id,
      _id_car: car._id,
      start_date: new Date('2024-09-02'),
      end_date: new Date('2024-09-06'),
    };

    await expect(
      updateReserveService.execute(updatedReserveData),
    ).rejects.toThrow(RESERVE_NOT_FOUND);
  });

  it('should not be able to update a reserve with non-existent user', async () => {
    const user = {
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
    await userRepositoryInMemory.create(user);

    const car = {
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
    await carRepositoryInMemory.create(car);

    const reserveData = {
      _id_user: user._id,
      _id_car: car._id,
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
    };
    const createdReserve = await reserveRepositoryInMemory.create(reserveData);

    const nonExistentUserId = new ObjectId();
    const updatedReserveData = {
      _id: createdReserve._id,
      _id_user: nonExistentUserId,
      _id_car: car._id,
      start_date: new Date('2024-09-02'),
      end_date: new Date('2024-09-06'),
    };

    await expect(
      updateReserveService.execute(updatedReserveData),
    ).rejects.toThrow(USER_NOT_FOUND);
  });

  it('should not be able to update a reserve with non-qualified user', async () => {
    const user1 = {
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
    await userRepositoryInMemory.create(user1);

    const user2 = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e2'),
      name: 'João',
      cpf: '222.000.222-22',
      birthday: new Date('1995-09-10'),
      email: 'joao@gmail.com',
      password: 'abcdef',
      qualified: 'no' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };
    await userRepositoryInMemory.create(user2);

    const car = {
      _id: new ObjectId('615b7a18453a19a07f1cc3e3'),
      model: 'Civic',
      color: 'Red',
      year: '2020',
      value_per_day: 200,
      number_of_passengers: 5,
      accessories: [
        { _id: new ObjectId(), description: 'GPS' },
        { _id: new ObjectId(), description: 'Airbag' },
      ],
    };
    await carRepositoryInMemory.create(car);

    const reserveData = {
      _id_user: user1._id,
      _id_car: car._id,
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
    };
    const createdReserve = await reserveRepositoryInMemory.create(reserveData);

    const updatedReserveData = {
      _id: createdReserve._id,
      _id_user: user2._id,
      _id_car: car._id,
      start_date: new Date('2024-09-02'),
      end_date: new Date('2024-09-06'),
    };

    await expect(
      updateReserveService.execute(updatedReserveData),
    ).rejects.toThrow(UNQUALIFIED_USER);
  });

  it('should not be able to update a reserve with non-existent car', async () => {
    const user = {
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
    await userRepositoryInMemory.create(user);

    const car = {
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
    await carRepositoryInMemory.create(car);

    const reserveData = {
      _id_user: user._id,
      _id_car: car._id,
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
    };
    const createdReserve = await reserveRepositoryInMemory.create(reserveData);

    const nonExistentCarId = new ObjectId();
    const updatedReserveData = {
      _id: createdReserve._id,
      _id_user: user._id,
      _id_car: nonExistentCarId,
      start_date: new Date('2024-09-02'),
      end_date: new Date('2024-09-06'),
    };

    await expect(
      updateReserveService.execute(updatedReserveData),
    ).rejects.toThrow(CAR_NOT_FOUND);
  });

  it('should not be able to update a reserve for the same car on the same day', async () => {
    const user1 = {
      _id: new ObjectId('66875d997a48231de79979d7'),
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

    const user2 = {
      _id: new ObjectId('66885a5d064b30c0f0aa7867'),
      name: 'João',
      cpf: '222.000.222-22',
      birthday: new Date('2001-09-18'),
      email: 'joao@gmail.com',
      password: '654321',
      qualified: 'yes' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };

    const car = {
      _id: new ObjectId('6688a30021837b03599691bf'),
      model: 'Palio',
      color: 'Silver',
      year: '2023',
      value_per_day: 120,
      number_of_passengers: 5,
      accessories: [
        { _id: new ObjectId(), description: 'GPS' },
        { _id: new ObjectId(), description: 'Airbag' },
      ],
    };

    await userRepositoryInMemory.create(user1);
    await userRepositoryInMemory.create(user2);
    await carRepositoryInMemory.create(car);

    const reserve1 = {
      _id: new ObjectId('66895f2abe77a6f4bd5c3f30'),
      _id_user: user1._id,
      _id_car: car._id,
      start_date: new Date('2015-08-07'),
      end_date: new Date('2015-08-10'),
      final_value: 1600,
    };

    const reserve2 = {
      _id: new ObjectId('66895f61be77a6f4bd5c3f31'),
      _id_user: user2._id,
      _id_car: car._id,
      start_date: new Date('2015-08-11'),
      end_date: new Date('2015-08-12'),
      final_value: 800,
    };

    await reserveRepositoryInMemory.create(reserve1);
    await reserveRepositoryInMemory.create(reserve2);

    const updatedReserveData = {
      _id: reserve1._id,
      _id_user: reserve1._id_user,
      _id_car: reserve1._id_car,
      start_date: new Date('2015-08-12'),
      end_date: new Date('2015-08-12'),
    };

    await expect(
      updateReserveService.execute(updatedReserveData),
    ).rejects.toThrow(CAR_ALREADY_RESERVED_SAME_DAY);
  });

  it('Should not be able to update a reserve if user already has a reservation on that date', async () => {
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
      _id: new ObjectId('615b7a18453a19a07f1cc3e4'),
      _id_user: userData._id,
      _id_car: carData1._id,
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
      final_value: 600,
    };

    const reserveData2 = {
      _id: new ObjectId('615b7a18453a19a07f1cc3a5'),
      _id_user: userData._id,
      _id_car: carData1._id,
      start_date: new Date('2024-08-15'),
      end_date: new Date('2024-08-20'),
    };

    await reserveRepositoryInMemory.create(reserveData1);
    await reserveRepositoryInMemory.create(reserveData2);

    const updatedReserveData = {
      _id: reserveData1._id,
      _id_user: userData._id,
      _id_car: carData2._id,
      start_date: new Date('2024-08-17'),
      end_date: new Date('2024-08-20'),
    };

    await expect(
      updateReserveService.execute(updatedReserveData),
    ).rejects.toThrow(USER_ALREADY_HAS_RESERVATION_IN_DATE);
  });
});
