import { inject, injectable } from 'tsyringe';
import { IUpdateUser } from '../domain/models/IUpdateUser';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUserRepository';
import { IHashProvider } from '../providers/models/IHashedProvider';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { BusinessError } from '@shared/errors/BusinessError';
import {
  CPF_ALREADY_USED,
  EMAIL_ALREADY_USED,
  UNDERAGE_USER,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorMessagesConsts';
import { isAtLeast18YearsOld } from '../utils/formatUtils';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    _id,
    name,
    cpf,
    birthday,
    email,
    password,
    qualified,
    cep,
    complement,
    neighborhood,
    locality,
    uf,
  }: IUpdateUser): Promise<IUser> {
    const userToUpdate = await this.usersRepository.findById(_id);

    if (!userToUpdate) {
      throw new NotFoundError(USER_NOT_FOUND);
    }

    if (!isAtLeast18YearsOld(birthday)) {
      throw new BusinessError(UNDERAGE_USER);
    }

    if (cpf && cpf !== userToUpdate.cpf) {
      const cpfExists = await this.usersRepository.findByCpf(cpf);
      if (cpfExists) {
        throw new BusinessError(CPF_ALREADY_USED);
      }
      userToUpdate.cpf = cpf;
    }

    if (email && email !== userToUpdate.email) {
      const emailExists = await this.usersRepository.findByEmail(email);
      if (emailExists) {
        throw new BusinessError(EMAIL_ALREADY_USED);
      }
      userToUpdate.email = email;
    }

    if (name && name !== userToUpdate.name) {
      userToUpdate.name = name;
    }

    if (birthday && birthday !== userToUpdate.birthday) {
      userToUpdate.birthday = birthday;
    }

    if (qualified && qualified !== userToUpdate.qualified) {
      userToUpdate.qualified = qualified;
    }

    if (cep && cep !== userToUpdate.cep) {
      userToUpdate.cep = cep;
      userToUpdate.complement = complement;
      userToUpdate.neighborhood = neighborhood;
      userToUpdate.locality = locality;
      userToUpdate.uf = uf;
    }

    if (password) {
      userToUpdate.password = await this.hashProvider.generateHash(password);
    }

    const updatedUser = await this.usersRepository.save(userToUpdate);

    return updatedUser;
  }
}

export default UpdateUserService;
