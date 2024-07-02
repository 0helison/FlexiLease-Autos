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

  public async execute({
    offset,
    limit,
    name,
    birthday,
    qualified,
    cep,
    complement,
    neighborhood,
    locality,
    uf,
  }: ISearchParamsList): Promise<IPaginateUser> {
    const result = await this.usersRepository.findAll({
      offset,
      limit,
      name,
      birthday,
      qualified,
      cep,
      complement,
      neighborhood,
      locality,
      uf,
    });

    return result;
  }
}

export default ListUserService;
