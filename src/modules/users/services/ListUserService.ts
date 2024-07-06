import { inject, injectable } from 'tsyringe';
import { IPaginateUser } from '../domain/models/IPaginateUser';
import { IUsersRepository } from '../domain/repositories/IUserRepository';
import { ISearchParamsList } from '../domain/models/ISearchParamsList';

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(params: ISearchParamsList): Promise<IPaginateUser> {
    const result = await this.usersRepository.findAll(params);

    return result;
  }
}

export default ListUserService;
