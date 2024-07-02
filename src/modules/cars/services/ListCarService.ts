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

  public async execute(params: ISearchParamsList): Promise<IPaginateCar> {
    const result = await this.carRepository.findAll(params);

    return result;
  }
}

export default ListCarService;
