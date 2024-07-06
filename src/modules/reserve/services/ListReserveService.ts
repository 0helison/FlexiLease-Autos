import { inject, injectable } from 'tsyringe';
import { ISearchParamsList } from '../domain/models/ISearchParamsList';
import { IPaginateReserve } from '../domain/models/IPaginateReserve';
import { IReserveRepository } from '../domain/repositories/IReserveRepository';

@injectable()
class ListReserveService {
  constructor(
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository,
  ) {}

  public async execute(params: ISearchParamsList): Promise<IPaginateReserve> {
    const result = await this.reserveRepository.findAll(params);

    return result;
  }
}

export default ListReserveService;
