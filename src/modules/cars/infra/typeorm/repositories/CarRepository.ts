import { Repository } from 'typeorm';
import { dataSource } from '@shared/infra/typeorm';
import { Car } from '../entities/Cars';
import { ObjectId } from 'mongodb';
import { ICarRepository } from '@modules/cars/domain/repositories/ICarRepository';
import { ICar } from '@modules/cars/domain/models/ICar';
import { ICreateCar } from '@modules/cars/domain/models/ICreateCar';
import { IPaginateCar } from '@modules/cars/domain/models/IPaginateCar';

interface SearchParams {
  limit: number;
  offset: number;
  model?: string;
  color?: string;
  year?: string;
  value_per_day?: number;
  number_of_passengers?: number;
  accessories?: Array<{ description: string }>;
}

class CarRepository implements ICarRepository {
  private ormRepository: Repository<Car>;

  constructor() {
    this.ormRepository = dataSource.getMongoRepository(Car);
  }

  public async findById(_id: ObjectId): Promise<ICar | null> {
    const car = await this.ormRepository.findOne({
      where: {
        _id,
      },
    });

    return car || null;
  }

  public async create({
    model,
    color,
    year,
    value_per_day,
    number_of_passengers,
    accessories,
  }: ICreateCar): Promise<ICar> {
    const car = this.ormRepository.create({
      model,
      color,
      year,
      value_per_day,
      number_of_passengers,
      accessories,
    });

    await this.ormRepository.save(car);

    return car;
  }

  public async save(car: ICar): Promise<ICar> {
    await this.ormRepository.save(car);

    return car;
  }

  public async remove(car: ICar): Promise<void> {
    await this.ormRepository.remove(car);
  }

  public async findAll({
    offset,
    limit,
    model,
    color,
    year,
    value_per_day,
    number_of_passengers,
    accessories,
  }: SearchParams): Promise<IPaginateCar> {
    const skip = (Number(offset) - 1) * limit;

    const where: any = {};

    if (model) {
      where['model'] = { $regex: new RegExp(model, 'i') };
    }
    if (color) {
      where['color'] = { $regex: new RegExp(color, 'i') };
    }
    if (year) {
      where['year'] = year;
    }
    if (value_per_day) {
      where['value_per_day'] = value_per_day;
    }
    if (number_of_passengers) {
      where['number_of_passengers'] = number_of_passengers;
    }
    if (accessories) {
      const accessoryRegexes = accessories.map(
        acc => new RegExp(acc.description, 'i'),
      );
      where['accessories.description'] = { $in: accessoryRegexes };
    }

    const [cars, count] = await this.ormRepository.findAndCount({
      where,
      skip: offset,
      take: limit,
    });

    const result: IPaginateCar = {
      cars,
      limit,
      total: count,
      offset,
      offsets: Math.ceil(count / limit),
    };

    return result;
  }
}

export default CarRepository;
