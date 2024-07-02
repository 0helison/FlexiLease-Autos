import { inject, injectable } from 'tsyringe';
import { BusinessError } from '@shared/errors/BusinessError';
import {
  CAR_ALREADY_RESERVED_SAME_DAY,
  CAR_NOT_FOUND,
  DATE_ORDER_INVALID,
  UNQUALIFIED_USER,
  USER_ALREADY_HAS_RESERVATION_IN_DATE,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorMessagesConsts';
import { ICreateReserve } from '../domain/models/ICreateReserve';
import { IReserve } from '../domain/models/IReserve';
import { IReserveRepository } from '../domain/repositories/IReserveRepository';
import { ICarRepository } from '@modules/cars/domain/repositories/ICarRepository';
import { IUsersRepository } from '@modules/users/domain/repositories/IUserRepository';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { differenceInDays } from 'date-fns';
import { dateOrderValidation, generateDateRange } from '../utils/dateUtils';

@injectable()
class CreateReserveService {
  constructor(
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  public async execute({
    _id_user,
    _id_car,
    start_date,
    end_date,
  }: ICreateReserve): Promise<IReserve> {
    const userExist = await this.usersRepository.findById(_id_user);

    if (!userExist) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    if (userExist.qualified !== 'yes') {
      throw new BusinessError(UNQUALIFIED_USER);
    }

    const carExist = await this.carRepository.findById(_id_car);

    if (!carExist) {
      throw new NotFoundError(CAR_NOT_FOUND);
    }

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

    const final_value =
      carExist.value_per_day * (differenceInDays(end_date, start_date) + 1);

    const reserve = await this.reserveRepository.create({
      _id_user,
      _id_car,
      start_date,
      end_date,
      final_value,
    });

    await this.reserveRepository.save(reserve);

    return reserve;
  }
}

export default CreateReserveService;
