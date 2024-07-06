import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import ListReserveService from '@modules/reserve/services/ListReserveService';
import ReserveRepositoryInMemory from '@modules/reserve/infra/typeorm/repositories/inMemory/ReserveRepositoryInMemory';
import { ISearchParamsList } from '@modules/reserve/domain/models/ISearchParamsList';
import { IPaginateReserve } from '@modules/reserve/domain/models/IPaginateReserve';

describe('ListReserveService', () => {
  let reserveRepositoryInMemory: ReserveRepositoryInMemory;
  let listReserveService: ListReserveService;

  beforeEach(() => {
    reserveRepositoryInMemory = new ReserveRepositoryInMemory();
    listReserveService = new ListReserveService(reserveRepositoryInMemory);
  });

  it('should be able to list all reserves without filter', async () => {
    const reservesData = [
      {
        _id_user: new ObjectId(),
        _id_car: new ObjectId(),
        start_date: new Date('2024-08-01'),
        end_date: new Date('2024-08-05'),
        final_value: 750,
      },
      {
        _id_user: new ObjectId(),
        _id_car: new ObjectId(),
        start_date: new Date('2024-08-10'),
        end_date: new Date('2024-08-15'),
        final_value: 1000,
      },
    ];

    await Promise.all(
      reservesData.map(reserveData =>
        reserveRepositoryInMemory.create(reserveData),
      ),
    );

    const params: ISearchParamsList = {
      limit: 10,
      offset: 0,
    };

    const result: IPaginateReserve = await listReserveService.execute(params);

    expect(result.reserves).toHaveLength(2);
  });

  it('should be able to list reserves with pagination', async () => {
    const reservesData = [
      {
        _id_user: new ObjectId(),
        _id_car: new ObjectId(),
        start_date: new Date('2024-08-01'),
        end_date: new Date('2024-08-05'),
        final_value: 750,
      },
      {
        _id_user: new ObjectId(),
        _id_car: new ObjectId(),
        start_date: new Date('2024-08-10'),
        end_date: new Date('2024-08-15'),
        final_value: 1000,
      },
    ];

    await Promise.all(
      reservesData.map(reserveData =>
        reserveRepositoryInMemory.create(reserveData),
      ),
    );

    const params: ISearchParamsList = {
      limit: 1,
      offset: 0,
    };

    const result1: IPaginateReserve = await listReserveService.execute(params);

    expect(result1.reserves).toHaveLength(1);
    expect(result1.total).toBe(2);

    params.offset = 1;
    const result2: IPaginateReserve = await listReserveService.execute(params);

    expect(result2.reserves).toHaveLength(1);
    expect(result2.offset).toBe(1);
  });
});
