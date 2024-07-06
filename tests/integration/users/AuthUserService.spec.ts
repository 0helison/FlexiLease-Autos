import 'reflect-metadata';
import { Qualified } from '@modules/users/domain/enums/Qualified';
import UserRepositoryInMemory from '@modules/users/infra/typeorm/repositories/inMemory/UserRepositoryInMemory';
import AuthUserService from '@modules/users/services/AuthUserService';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import HashProviderInMemory from '@modules/users/infra/typeorm/repositories/inMemory/HashProviderInMemory';
import { EMAIL_PASSWORD_INVALID } from '@shared/consts/ErrorMessagesConsts';

describe('AuthUser', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let authUserService: AuthUserService;
  let hashProviderInMemory: HashProviderInMemory;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    authUserService = new AuthUserService(
      userRepositoryInMemory,
      hashProviderInMemory,
    );
  });

  it('should be able to authenticate', async () => {
    const userData = {
      name: 'Maria',
      cpf: '111.000.111-11',
      birthday: new Date('2000-08-17'),
      email: 'maria@gmail.com',
      password: await hashProviderInMemory.generateHash('123456'),
      qualified: 'yes' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };

    const user = await userRepositoryInMemory.create(userData);

    const response = await authUserService.execute({
      email: 'maria@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non-existent user', async () => {
    await expect(
      authUserService.execute({
        email: 'nonexistent@gmail.com',
        password: '123456',
      }),
    ).rejects.toThrow(AuthenticationError);
    await expect(
      authUserService.execute({
        email: 'nonexistent@gmail.com',
        password: '123456',
      }),
    ).rejects.toThrow(EMAIL_PASSWORD_INVALID);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const userData = {
      name: 'Maria',
      cpf: '111.000.111-11',
      birthday: new Date('2000-08-17'),
      email: 'maria@gmail.com',
      password: await hashProviderInMemory.generateHash('123456'),
      qualified: 'yes' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };
    await userRepositoryInMemory.create(userData);

    await expect(
      authUserService.execute({
        email: 'maria@gmail.com',
        password: '567890',
      }),
    ).rejects.toThrow(AuthenticationError);
    await expect(
      authUserService.execute({
        email: 'maria@gmail.com',
        password: '567890',
      }),
    ).rejects.toThrow(EMAIL_PASSWORD_INVALID);
  });
});
