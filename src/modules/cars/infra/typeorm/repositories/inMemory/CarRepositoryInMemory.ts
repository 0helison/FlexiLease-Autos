import { ObjectId } from 'mongodb';
import { ICarRepository } from '@modules/cars/domain/repositories/ICarRepository';
import { ICar } from '@modules/cars/domain/models/ICar';
import { ICreateCar } from '@modules/cars/domain/models/ICreateCar';
import { IPaginateCar } from '@modules/cars/domain/models/IPaginateCar';
import { ISearchParamsList } from '@modules/cars/domain/models/ISearchParamsList';

class CarRepositoryInMemory implements ICarRepository {
  private cars: ICar[] = [];

  public async findById(_id: ObjectId): Promise<ICar | null> {
    return this.cars.find(car => car._id.equals(_id)) || null;
  }

  public async create(fields: ICreateCar): Promise<ICar> {
    const car: ICar = {
      _id: new ObjectId(),
      ...fields,
    };

    this.cars.push(car);

    return car;
  }

  public async save(car: ICar): Promise<ICar> {
    const findIndex = this.cars.findIndex(findCar =>
      findCar._id.equals(car._id),
    );

    this.cars[findIndex] = car;

    return car;
  }

  public async remove(car: ICar): Promise<void> {
    this.cars = this.cars.filter(c => !c._id.equals(car._id));
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
  }: ISearchParamsList): Promise<IPaginateCar> {
    let filteredCars = this.cars;

    if (model) {
      filteredCars = filteredCars.filter(car =>
        car.model.toLowerCase().includes(model.toLowerCase()),
      );
    }
    if (color) {
      filteredCars = filteredCars.filter(car =>
        car.color.toLowerCase().includes(color.toLowerCase()),
      );
    }
    if (year) {
      filteredCars = filteredCars.filter(car => car.year === year);
    }
    if (value_per_day) {
      filteredCars = filteredCars.filter(
        car => car.value_per_day === value_per_day,
      );
    }
    if (number_of_passengers) {
      filteredCars = filteredCars.filter(
        car => car.number_of_passengers === number_of_passengers,
      );
    }
    if (accessories) {
      const accessoryDescriptions = accessories.map(acc => acc.description);
      filteredCars = filteredCars.filter(car =>
        car.accessories.some(acc =>
          accessoryDescriptions.includes(acc.description),
        ),
      );
    }

    const paginatedCars = filteredCars.slice(offset, offset + limit);

    return {
      cars: paginatedCars,
      limit,
      total: filteredCars.length,
      offset,
      offsets: Math.ceil(filteredCars.length / limit),
    };
  }
}

export default CarRepositoryInMemory;
