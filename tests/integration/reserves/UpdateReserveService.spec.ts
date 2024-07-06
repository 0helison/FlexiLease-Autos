import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import { Qualified } from '@modules/users/domain/enums/Qualified';
import UpdateReserveService from '@modules/reserve/services/UpdateReserveService';
import ReserveRepositoryInMemory from '@modules/reserve/infra/typeorm/repositories/inMemory/ReserveRepositoryInMemory';
import CarRepositoryInMemory from '@modules/cars/infra/typeorm/repositories/inMemory/CarRepositoryInMemory';
import UserRepositoryInMemory from '@modules/users/infra/typeorm/repositories/inMemory/UserRepositoryInMemory';

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
});
