import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUserRepository';
import { IDeleteUser } from '../domain/models/IDeleteUser';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { USER_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ _id }: IDeleteUser): Promise<void> {
    const user = await this.usersRepository.findById(_id);

    if (!user) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    await this.usersRepository.remove(user);
  }
}

export default DeleteUserService;
