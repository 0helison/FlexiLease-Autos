import { inject, injectable } from 'tsyringe';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { IReserveRepository } from '../domain/repositories/IReserveRepository';
import { IUpdateReserve } from '../domain/models/IUpdateReserve';
import { IReserve } from '../domain/models/IReserve';
import {
  CAR_ALREADY_RESERVED_SAME_DAY,
  CAR_NOT_FOUND,
  DATE_ORDER_INVALID,
  RESERVE_NOT_FOUND,
  UNQUALIFIED_USER,
  USER_ALREADY_HAS_RESERVATION_IN_DATE,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorMessagesConsts';
import { BusinessError } from '@shared/errors/BusinessError';
import { IUsersRepository } from '@modules/users/domain/repositories/IUserRepository';
import { ICarRepository } from '@modules/cars/domain/repositories/ICarRepository';
import { dateOrderValidation, generateDateRange } from '../utils/dateUtils';
import { differenceInDays } from 'date-fns';

@injectable()
class UpdateReserveService {
  constructor(
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  public async execute({
    _id,
    _id_user,
    _id_car,
    start_date,
    end_date,
  }: IUpdateReserve): Promise<IReserve> {
    const reserveToUpdate = await this.reserveRepository.findById(_id);

    if (!reserveToUpdate) {
      throw new NotFoundError(RESERVE_NOT_FOUND);
    }

    if (_id_user && _id_user !== reserveToUpdate._id_user) {
      const userExist = await this.usersRepository.findById(_id_user);

      if (!userExist) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      if (userExist.qualified !== 'yes') {
        throw new BusinessError(UNQUALIFIED_USER);
      }
      reserveToUpdate._id_user = _id_user;
    }

    if (_id_car && _id_car !== reserveToUpdate._id_car) {
      const carExist = await this.carRepository.findById(_id_car);

      if (!carExist) {
        throw new NotFoundError(CAR_NOT_FOUND);
      }
      reserveToUpdate._id_car = _id_car;
    }

    if (
      start_date &&
      start_date !== reserveToUpdate.start_date &&
      end_date &&
      end_date !== reserveToUpdate.end_date
    ) {
      if (dateOrderValidation(start_date, end_date)) {
        throw new BusinessError(DATE_ORDER_INVALID);
      }

      const existingReserveSameDay =
        await this.reserveRepository.findByCarAndDate(_id_car, start_date);

      if (existingReserveSameDay) {
        throw new BusinessError(CAR_ALREADY_RESERVED_SAME_DAY);
      }

      const existingReservesInRange =
        await this.reserveRepository.findByUserId(_id_user);

      for (const reserveInRange of existingReservesInRange) {
        const reserveDates = generateDateRange(
          reserveInRange.start_date,
          reserveInRange.end_date,
        );

        if (reserveDates.some(date => date >= start_date && date <= end_date)) {
          throw new BusinessError(USER_ALREADY_HAS_RESERVATION_IN_DATE);
        }
      }
      reserveToUpdate.start_date = start_date;
      reserveToUpdate.end_date = end_date;
    }

    const finalValueUpdate = await this.carRepository.findById(_id_car);

    if (finalValueUpdate) {
      reserveToUpdate.final_value =
        finalValueUpdate?.value_per_day *
        (differenceInDays(end_date, start_date) + 1);
    }

    const updateReserve = await this.reserveRepository.save(reserveToUpdate);

    return updateReserve;
  }
}

export default UpdateReserveService;
