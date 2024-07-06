import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import ShowReserveService from '@modules/reserve/services/ShowReserveService';
import ReserveRepositoryInMemory from '@modules/reserve/infra/typeorm/repositories/inMemory/ReserveRepositoryInMemory';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { RESERVE_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';

describe('ShowReserve', () => {
  let reserveRepositoryInMemory: ReserveRepositoryInMemory;
  let showReserveService: ShowReserveService;

  beforeEach(() => {
    reserveRepositoryInMemory = new ReserveRepositoryInMemory();
    showReserveService = new ShowReserveService(reserveRepositoryInMemory);
  });

  it('should be able to show an existing reserve', async () => {
    const reserveData = {
      _id: new ObjectId(),
      _id_user: new ObjectId(),
      _id_car: new ObjectId(),
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
      final_value: 750,
    };

    await reserveRepositoryInMemory.create(reserveData);

    const shownReserve = await showReserveService.execute({
      _id: reserveData._id,
    });

    expect(shownReserve).toBeDefined();
    expect(shownReserve._id).toEqual(reserveData._id);
    expect(shownReserve._id_user).toEqual(reserveData._id_user);
    expect(shownReserve._id_car).toEqual(reserveData._id_car);
    expect(shownReserve.start_date.toISOString()).toBe(
      reserveData.start_date.toISOString(),
    );
    expect(shownReserve.end_date.toISOString()).toBe(
      reserveData.end_date.toISOString(),
    );
    expect(shownReserve.final_value).toBe(reserveData.final_value);
  });

  it('should not be able to show a non-existent reserve', async () => {
    const nonExistentReserveId = new ObjectId();

    await expect(
      showReserveService.execute({ _id: nonExistentReserveId }),
    ).rejects.toThrow(NotFoundError);
    await expect(
      showReserveService.execute({ _id: nonExistentReserveId }),
    ).rejects.toThrow(RESERVE_NOT_FOUND);
  });
});
