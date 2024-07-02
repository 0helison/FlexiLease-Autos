import { inject, injectable } from 'tsyringe';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import { ICarRepository } from '../domain/repositories/ICarRepository';
import { IDeleteCar } from '../domain/models/IDeleteCar';

@injectable()
class DeleteCarService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  public async execute({ _id }: IDeleteCar): Promise<void> {
    const car = await this.carRepository.findById(_id);

    if (!car) {
      throw new NotFoundError(CAR_NOT_FOUND);
    }

    await this.carRepository.remove(car);
  }
}

export default DeleteCarService;
