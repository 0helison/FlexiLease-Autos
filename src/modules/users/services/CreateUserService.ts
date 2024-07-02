import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUserRepository';
import { BusinessError } from '@shared/errors/BusinessError';
import {
  CPF_ALREADY_USED,
  EMAIL_ALREADY_USED,
  UNDERAGE_USER,
} from '@shared/consts/ErrorMessagesConsts';
import { IHashProvider } from '../providers/models/IHashedProvider';

import { differenceInYears } from 'date-fns';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUser } from '@modules/users/domain/models/IUser';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
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
  }: ICreateUser): Promise<IUser> {
    function isAtLeast18YearsOld(date: Date): boolean {
      return differenceInYears(Date.now(), date) >= 18;
    }

    if (!isAtLeast18YearsOld(birthday)) {
      throw new BusinessError(UNDERAGE_USER);
    }

    const cpfExists = await this.usersRepository.findByCpf(cpf);
    if (cpfExists) {
      throw new BusinessError(CPF_ALREADY_USED);
    }

    const emailExists = await this.usersRepository.findByEmail(email);
    if (emailExists) {
      throw new BusinessError(EMAIL_ALREADY_USED);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      cpf,
      birthday,
      email,
      password: hashedPassword,
      qualified,
      cep,
      complement,
      neighborhood,
      locality,
      uf,
    });

    await this.usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
