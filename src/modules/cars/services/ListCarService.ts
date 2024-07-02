import { inject, injectable } from 'tsyringe';
import { ICarRepository } from '../domain/repositories/ICarRepository';
import { IPaginateCar } from '../domain/models/IPaginateCar';
import { ISearchParamsList } from '../domain/models/ISearchParamsList';

@injectable()
class ListCarService {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  public async execute({
    limit,
    offset,
    model,
    color,
    year,
    value_per_day,
    number_of_passengers,
    accessories,
  }: ISearchParamsList): Promise<IPaginateCar> {
    const result = await this.carRepository.findAll({
      limit,
      offset,
      model,
      color,
      year,
      value_per_day,
      number_of_passengers,
      accessories,
    });

    return result;
  }
}

export default ListCarService;
