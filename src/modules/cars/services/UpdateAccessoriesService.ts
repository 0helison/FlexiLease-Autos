import { inject, injectable } from 'tsyringe';
import { ObjectId } from 'mongodb';
import { ICarRepository } from '../domain/repositories/ICarRepository';
import { IAccessory, ICar } from '../domain/models/ICar';
import { NotFoundError } from '@shared/errors/NotFoundError';
import {
  CAR_NOT_FOUND,
  NON_REPEAT_ACCESSORIES,
} from '@shared/consts/ErrorMessagesConsts';
import { IUpdateAccessory } from '../domain/models/IUpdateAccessory';
import { BusinessError } from '@shared/errors/BusinessError';

@injectable()
class UpdateAccessoryService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  public async execute({
    _id,
    _id_accessory,
    description,
  }: IUpdateAccessory): Promise<ICar> {
    const car = await this.carRepository.findById(_id);

    if (!car) {
      throw new NotFoundError(CAR_NOT_FOUND);
    }

    const descriptions = car.accessories
      .filter(acc => !acc._id.equals(_id_accessory))
      .map(acc => acc.description.toLowerCase());

    if (descriptions.includes(description.toLowerCase())) {
      throw new BusinessError(NON_REPEAT_ACCESSORIES);
    }

    const existingAccessory = car.accessories.find(acc =>
      acc._id.equals(_id_accessory),
    );

    if (existingAccessory) {
      existingAccessory.description = description;
    } else {
      const newAccessory: IAccessory = {
        description,
        _id: new ObjectId(),
      };

      car.accessories.push(newAccessory);
    }

    await this.carRepository.save(car);

    return car;
  }
}

export default UpdateAccessoryService;
