import { ObjectId } from 'mongodb';
import { ICreateCar } from '../domain/models/ICreateCar';
import { ICar } from '../domain/models/ICar';
import { inject, injectable } from 'tsyringe';
import { ICarRepository } from '../domain/repositories/ICarRepository';

@injectable()
class CreateCarService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  public async execute({
    model,
    color,
    year,
    value_per_day,
    number_of_passengers,
    accessories,
  }: ICreateCar): Promise<ICar> {
    const accessoriesWithIds = accessories.map(accessory => ({
      ...accessory,
      _id: new ObjectId(),
    }));

    const car = await this.carRepository.create({
      model,
      color,
      year,
      value_per_day,
      number_of_passengers,
      accessories: accessoriesWithIds,
    });

    await this.carRepository.save(car);

    return car;
  }
}

export default CreateCarService;
