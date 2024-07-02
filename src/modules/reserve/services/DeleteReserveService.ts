import { inject, injectable } from 'tsyringe';

import { NotFoundError } from '@shared/errors/NotFoundError';
import { IReserveRepository } from '../domain/repositories/IReserveRepository';
import { IDeleteReserve } from '../domain/models/IDeleteReserve';
import { RESERVE_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';

@injectable()
class DeleteReserveService {
  constructor(
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository,
  ) {}

  public async execute({ _id }: IDeleteReserve): Promise<void> {
    const reserve = await this.reserveRepository.findById(_id);

    if (!reserve) {
      throw new NotFoundError(RESERVE_NOT_FOUND);
    }

    await this.reserveRepository.remove(reserve);
  }
}

export default DeleteReserveService;
