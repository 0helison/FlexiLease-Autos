import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import UserRepositoryInMemory from '@modules/users/infra/typeorm/repositories/inMemory/UserRepositoryInMemory';
import ShowUserService from '@modules/users/services/ShowUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { USER_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import { Qualified } from '@modules/users/domain/enums/Qualified';
import HashProviderInMemory from '@modules/users/infra/typeorm/repositories/inMemory/HashProviderInMemory';

describe('ShowUser', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let showUserService: ShowUserService;
  let createUserService: CreateUserService;
  let hashProviderInMemory: HashProviderInMemory;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    createUserService = new CreateUserService(
      userRepositoryInMemory,
      hashProviderInMemory,
    );
    showUserService = new ShowUserService(userRepositoryInMemory);
  });

  it('should be able to show a user', async () => {
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

    const createdUser = await createUserService.execute(userData);

    const user = await showUserService.execute({ _id: createdUser._id });

    expect(user).toHaveProperty('_id');
    expect(user.name).toBe('Maria');
    expect(user.cpf).toBe('111.000.111-11');
    expect(user.birthday.toISOString()).toBe(
      new Date('2000-08-17').toISOString(),
    );
    expect(user.email).toBe('maria@gmail.com');
    expect(user.qualified).toBe('yes');
    expect(user.cep).toBe('58340-000');
    expect(user.complement).toBe('N/A');
    expect(user.neighborhood).toBe('N/A');
    expect(user.locality).toBe('Sapé');
    expect(user.uf).toBe('PB');
  });

  it('should not be able to show a non-existent user', async () => {
    const nonExistentUserId = new ObjectId();

    await expect(
      showUserService.execute({ _id: nonExistentUserId }),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(
      showUserService.execute({ _id: nonExistentUserId }),
    ).rejects.toThrow(USER_NOT_FOUND);
  });
});
