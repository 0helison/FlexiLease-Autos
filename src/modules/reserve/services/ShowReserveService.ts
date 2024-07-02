import { inject, injectable } from 'tsyringe';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { IReserveRepository } from '../domain/repositories/IReserveRepository';
import { IReserve } from '../domain/models/IReserve';
import { IShowReserve } from '../domain/models/IShowReserve';
import { RESERVE_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';

@injectable()
class ShowReserveService {
  constructor(
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository,
  ) {}

  public async execute({ _id }: IShowReserve): Promise<IReserve> {
    const reserve = await this.reserveRepository.findById(_id);

    if (!reserve) {
      throw new NotFoundError(RESERVE_NOT_FOUND);
    }

    return reserve;
  }
}

export default ShowReserveService;
