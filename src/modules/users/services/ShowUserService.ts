import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUserRepository';
import { IUser } from '../domain/models/IUser';
import { IShowUser } from '../domain/models/IShowUser';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { USER_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';

@injectable()
class ShowUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ _id }: IShowUser): Promise<IUser> {
    const user = await this.usersRepository.findById(_id);

    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    return user;
  }
}

export default ShowUsersService;
