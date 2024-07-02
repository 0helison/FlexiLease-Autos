import { inject, injectable } from 'tsyringe';
import { IPaginateUser } from '../domain/models/IPaginateUser';
import { IUsersRepository } from '../domain/repositories/IUserRepository';

interface SearchParams {
  limit: number;
  offset: number;
}

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    limit,
    offset,
  }: SearchParams): Promise<IPaginateUser> {
    const {
      users,
      total,
      offset: actualOffset,
      offsets: totalOffsets,
    } = await this.usersRepository.findAll({
      limit,
      offset,
    });

    return {
      users,
      limit,
      total,
      offset: actualOffset,
      offsets: totalOffsets,
    };
  }
}

export default ListUserService;
