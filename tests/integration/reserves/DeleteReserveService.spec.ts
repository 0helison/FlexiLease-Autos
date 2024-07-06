import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import DeleteReserveService from '@modules/reserve/services/DeleteReserveService';
import ReserveRepositoryInMemory from '@modules/reserve/infra/typeorm/repositories/inMemory/ReserveRepositoryInMemory';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { RESERVE_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';

describe('DeleteReserve', () => {
  let reserveRepositoryInMemory: ReserveRepositoryInMemory;
  let deleteReserveService: DeleteReserveService;

  beforeEach(() => {
    reserveRepositoryInMemory = new ReserveRepositoryInMemory();
    deleteReserveService = new DeleteReserveService(reserveRepositoryInMemory);
  });

  it('should be able to delete an existing reserve', async () => {
    const reserveData = {
      _id: new ObjectId(),
      _id_user: new ObjectId(),
      _id_car: new ObjectId(),
      start_date: new Date('2024-08-01'),
      end_date: new Date('2024-08-05'),
      final_value: 750,
    };

    await reserveRepositoryInMemory.create(reserveData);

    await expect(
      deleteReserveService.execute({ _id: reserveData._id }),
    ).resolves.not.toThrow();

    const foundReserve = await reserveRepositoryInMemory.findById(
      reserveData._id,
    );

    expect(foundReserve).toBeNull();
  });

  it('should not be able to delete a non-existent reserve', async () => {
    const nonExistentReserveId = new ObjectId();

    await expect(
      deleteReserveService.execute({ _id: nonExistentReserveId }),
    ).rejects.toThrow(NotFoundError);
    await expect(
      deleteReserveService.execute({ _id: nonExistentReserveId }),
    ).rejects.toThrow(RESERVE_NOT_FOUND);
  });
});
