import 'reflect-metadata';
import { Qualified } from '@modules/users/domain/enums/Qualified';
import UserRepositoryInMemory from '@modules/users/infra/typeorm/repositories/inMemory/UserRepositoryInMemory';
import CreateUserService from '@modules/users/services/CreateUserService';
import {
  CPF_ALREADY_USED,
  EMAIL_ALREADY_USED,
  UNDERAGE_USER,
} from '@shared/consts/ErrorMessagesConsts';
import HashProviderInMemory from '@modules/users/infra/typeorm/repositories/inMemory/HashProviderInMemory';
import { BusinessError } from '@shared/errors/BusinessError';

describe('CreateUser', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let createUserService: CreateUserService;
  let hashProviderInMemory: HashProviderInMemory;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    createUserService = new CreateUserService(
      userRepositoryInMemory,
      hashProviderInMemory,
    );
  });

  it('should be able to create a new user', async () => {
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

    const user = await createUserService.execute(userData);

    expect(user).toHaveProperty('_id');
    expect(user.name).toBe('Maria');
    expect(user.cpf).toBe('111.000.111-11');
    expect(user.birthday.toISOString()).toBe(
      new Date('2000-08-17').toISOString(),
    );
    expect(user.email).toBe('maria@gmail.com');
    expect(user.password).toBe('123456');
    expect(user.qualified).toBe('yes');
    expect(user.cep).toBe('58340-000');
    expect(user.complement).toBe('N/A');
    expect(user.neighborhood).toBe('N/A');
    expect(user.locality).toBe('Sapé');
    expect(user.uf).toBe('PB');
  });

  it('should not be able to create two users with the same cpf', async () => {
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

    await createUserService.execute(userData);

    await expect(createUserService.execute(userData)).rejects.toBeInstanceOf(
      BusinessError,
    );
    await expect(createUserService.execute(userData)).rejects.toThrow(
      CPF_ALREADY_USED,
    );
  });

  it('should not be able to create two users with the same email', async () => {
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

    const userData2 = {
      name: 'Maria',
      cpf: '111.000.111-22',
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

    await createUserService.execute(userData);

    await expect(createUserService.execute(userData2)).rejects.toBeInstanceOf(
      BusinessError,
    );
    await expect(createUserService.execute(userData2)).rejects.toThrow(
      EMAIL_ALREADY_USED,
    );
  });

  it('should not be able to create underage user', async () => {
    const userData = {
      name: 'Maria',
      cpf: '111.000.111-11',
      birthday: new Date('2020-08-17'),
      email: 'maria@gmail.com',
      password: await hashProviderInMemory.generateHash('123456'),
      qualified: 'yes' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };

    await expect(createUserService.execute(userData)).rejects.toBeInstanceOf(
      BusinessError,
    );
    await expect(createUserService.execute(userData)).rejects.toThrow(
      UNDERAGE_USER,
    );
  });
});
