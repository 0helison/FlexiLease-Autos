import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import UserRepositoryInMemory from '@modules/users/infra/typeorm/repositories/inMemory/UserRepositoryInMemory';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { USER_NOT_FOUND } from '@shared/consts/ErrorMessagesConsts';
import { Qualified } from '@modules/users/domain/enums/Qualified';
import HashProviderInMemory from '@modules/users/infra/typeorm/repositories/inMemory/HashProviderInMemory';

describe('DeleteUser', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let deleteUserService: DeleteUserService;
  let createUserService: CreateUserService;
  let hashProviderInMemory: HashProviderInMemory;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    createUserService = new CreateUserService(
      userRepositoryInMemory,
      hashProviderInMemory,
    );
    deleteUserService = new DeleteUserService(userRepositoryInMemory);
  });

  it('should be able to delete a user', async () => {
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

    await deleteUserService.execute({ _id: user._id });

    const deletedUser = await userRepositoryInMemory.findById(user._id);
    expect(deletedUser).toBe(null);
  });

  it('should not be able to delete a non-existent user', async () => {
    const nonExistentUserId = new ObjectId();

    await expect(
      deleteUserService.execute({ _id: nonExistentUserId }),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(
      deleteUserService.execute({ _id: nonExistentUserId }),
    ).rejects.toThrow(USER_NOT_FOUND);
  });
});
