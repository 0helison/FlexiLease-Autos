import { inject, injectable } from 'tsyringe';
import { IUpdateCar } from '../domain/models/IUpdateCar';
import { ICarRepository } from '../domain/repositories/ICarRepository';
import { ICar } from '../domain/models/ICar';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CAR_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';

@injectable()
class UpdateCarService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  public async execute({
    _id,
    model,
    color,
    year,
    value_per_day,
    number_of_passengers,
  }: IUpdateCar): Promise<ICar> {
    const carToUpdate = await this.carRepository.findById(_id);

    if (!carToUpdate) {
      throw new NotFoundError(CAR_NOT_FOUND);
    }

    if (model && model !== carToUpdate.model) {
      carToUpdate.model = model;
    }
    if (color && color !== carToUpdate.color) {
      carToUpdate.color = color;
    }
    if (year && year !== carToUpdate.year) {
      carToUpdate.year = year;
    }
    if (value_per_day && value_per_day !== carToUpdate.value_per_day) {
      carToUpdate.value_per_day = value_per_day;
    }
    if (
      number_of_passengers &&
      number_of_passengers !== carToUpdate.number_of_passengers
    ) {
      carToUpdate.number_of_passengers = number_of_passengers;
    }

    const updatedCar = await this.carRepository.save(carToUpdate);

    return updatedCar;
  }
}

export default UpdateCarService;
