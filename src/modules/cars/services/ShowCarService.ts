import { inject, injectable } from 'tsyringe';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import { IShowCar } from '../domain/models/IShowCar';
import { ICar } from '../domain/models/ICar';
import { ICarRepository } from '../domain/repositories/ICarRepository';

@injectable()
class ShowCarService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  public async execute({ _id }: IShowCar): Promise<ICar> {
    const car = await this.carRepository.findById(_id);

    if (!car) {
      throw new NotFoundError(CAR_NOT_FOUND);
    }

    return car;
  }
}

export default ShowCarService;
