import { inject, injectable } from 'tsyringe';
import { Secret } from 'jsonwebtoken';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { IUsersRepository } from '../domain/repositories/IUserRepository';
import { IHashProvider } from '../providers/models/IHashedProvider';
import { ICreateAuth } from '../domain/models/ICreateAuth';
import { IUserAuthenticated } from '../domain/models/IUserAuthenticated';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { EMAIL_PASSWORD_INVALID } from '@shared/consts/ErrorMessagesConsts';

@injectable()
class AuthUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
  }: ICreateAuth): Promise<IUserAuthenticated> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AuthenticationError(EMAIL_PASSWORD_INVALID);
    }

    const passwordConfirmed = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordConfirmed) {
      throw new AuthenticationError(EMAIL_PASSWORD_INVALID);
    }

    const token = sign({}, authConfig.jwt.secret as Secret, {
      subject: user._id.toString(),
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default AuthUserService;
