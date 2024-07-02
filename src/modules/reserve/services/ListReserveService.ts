import { inject, injectable } from 'tsyringe';
import { ISearchParamsList } from '../domain/models/ISearchParamsList';
import { IPaginateReserve } from '../domain/models/IPaginateReserve';
import { IReserveRepository } from '../domain/repositories/IReserveRepository';
import { ObjectId } from 'mongodb';

@injectable()
class ListReserveService {
  constructor(
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository,
  ) {}

  public async execute({
    limit,
    offset,
    _id_user,
    _id_car,
    start_date,
    end_date,
    final_value,
  }: ISearchParamsList): Promise<IPaginateReserve> {
    const result = await this.reserveRepository.findAll({
      limit,
      offset,
      _id_user,
      _id_car,
      start_date,
      end_date,
      final_value,
    });

    return result;
  }
}

export default ListReserveService;
