import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import UserRepositoryInMemory from '@modules/users/infra/typeorm/repositories/inMemory/UserRepositoryInMemory';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { BusinessError } from '@shared/errors/BusinessError';
import {
  CPF_ALREADY_USED,
  EMAIL_ALREADY_USED,
  UNDERAGE_USER,
  USER_NOT_FOUND,
} from '@shared/consts/ErrorMessagesConsts';
import { Qualified } from '@modules/users/domain/enums/Qualified';
import HashProviderInMemory from '@modules/users/infra/typeorm/repositories/inMemory/HashProviderInMemory';

describe('UpdateUserService', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let hashProviderInMemory: HashProviderInMemory;
  let updateUserService: UpdateUserService;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    hashProviderInMemory = new HashProviderInMemory();
    updateUserService = new UpdateUserService(
      userRepositoryInMemory,
      hashProviderInMemory,
    );
  });

  it('should be able to update all user data', async () => {
    const userData = {
      name: 'Maria',
      cpf: '111.000.111-11',
      birthday: new Date('2000-08-17'),
      email: 'maria@gmail.com',
      password: '123456',
      qualified: 'yes' as Qualified,
      cep: '58340-000',
      complement: 'N/A',
      neighborhood: 'N/A',
      locality: 'Sapé',
      uf: 'PB',
    };

    const createdUser = await userRepositoryInMemory.create(userData);

    const updatedUserData = {
      _id: createdUser._id,
      name: 'Maria Silva',
      cpf: '222.000.222-22',
      birthday: new Date('1990-05-20'),
      email: 'maria-silva@gmail.com',
      password: 'newpassword',
      qualified: 'no' as Qualified,
      cep: '58000-000',
      complement: 'Apt. 123',
      neighborhood: 'Centro',
      locality: 'João Pessoa',
      uf: 'PB',
    };

    const updatedUser = await updateUserService.execute(updatedUserData);

    expect(updatedUser._id).toEqual(createdUser._id);
    expect(updatedUser.name).toEqual(updatedUserData.name);
    expect(updatedUser.cpf).toEqual(updatedUserData.cpf);
    expect(updatedUser.birthday).toEqual(updatedUserData.birthday);
    expect(updatedUser.email).toEqual(updatedUserData.email);
    expect(updatedUser.qualified).toEqual(updatedUserData.qualified);
    expect(updatedUser.cep).toEqual(updatedUserData.cep);
    expect(updatedUser.complement).toEqual(updatedUserData.complement);
    expect(updatedUser.neighborhood).toEqual(updatedUserData.neighborhood);
    expect(updatedUser.locality).toEqual(updatedUserData.locality);
    expect(updatedUser.uf).toEqual(updatedUserData.uf);
    expect(updatedUser.password).not.toEqual(userData.password);
  });

  it('should not be able to update a non-existent user', async () => {
    const nonExistentUserId = new ObjectId();

    const updatedUserData = {
      _id: nonExistentUserId,
      name: 'João',
      cpf: '111.111.111-11',
      birthday: new Date('1990-01-01'),
      email: 'joao@example.com',
      password: 'newpassword',
      qualified: 'no' as Qualified,
      cep: '58000-000',
      complement: 'Apt. 123',
      neighborhood: 'Centro',
      locality: 'João Pessoa',
      uf: 'PB',
    };

    await expect(updateUserService.execute(updatedUserData)).rejects.toThrow(
      NotFoundError,
    );
    await expect(updateUserService.execute(updatedUserData)).rejects.toThrow(
      USER_NOT_FOUND,
    );
  });

  it('should not be able to update to a duplicate CPF', async () => {
    const userData1 = {
      name: 'Helena',
      cpf: '111.111.111-11',
      birthday: new Date('1990-01-01'),
      email: 'helena@example.com',
      password: 'password1',
      qualified: 'yes' as Qualified,
      cep: '58000-000',
      complement: 'Apt. 1',
      neighborhood: 'Centro',
      locality: 'João Pessoa',
      uf: 'PB',
    };

    const userData2 = {
      name: 'Pedro',
      cpf: '222.222.222-22',
      birthday: new Date('1990-02-02'),
      email: 'pedro@example.com',
      password: 'password2',
      qualified: 'no' as Qualified,
      cep: '58300-000',
      complement: 'Apt. 2',
      neighborhood: 'Centro',
      locality: 'Campina Grande',
      uf: 'PB',
    };

    await userRepositoryInMemory.create(userData1);
    const user2 = await userRepositoryInMemory.create(userData2);

    const updatedUserData = {
      _id: user2._id,
      name: user2.name,
      cpf: userData1.cpf,
      birthday: user2.birthday,
      email: user2.email,
      password: 'newpassword',
      qualified: 'yes' as Qualified,
      cep: user2.cep,
      complement: user2.complement,
      neighborhood: user2.neighborhood,
      locality: user2.locality,
      uf: user2.uf,
    };

    await expect(updateUserService.execute(updatedUserData)).rejects.toThrow(
      BusinessError,
    );
    await expect(updateUserService.execute(updatedUserData)).rejects.toThrow(
      CPF_ALREADY_USED,
    );
  });

  it('should not be able to update to a duplicate email', async () => {
    const userData1 = {
      name: 'Lucas',
      cpf: '111.111.111-11',
      birthday: new Date('1990-01-01'),
      email: 'lucas@example.com',
      password: 'password1',
      qualified: 'yes' as Qualified,
      cep: '58000-000',
      complement: 'Apt. 1',
      neighborhood: 'Centro',
      locality: 'João Pessoa',
      uf: 'PB',
    };

    const userData2 = {
      name: 'Marcos',
      cpf: '222.222.222-22',
      birthday: new Date('1990-02-02'),
      email: 'marcos@example.com',
      password: 'password2',
      qualified: 'no' as Qualified,
      cep: '58300-000',
      complement: 'Apt. 2',
      neighborhood: 'Centro',
      locality: 'Campina Grande',
      uf: 'PB',
    };

    await userRepositoryInMemory.create(userData1);
    const user2 = await userRepositoryInMemory.create(userData2);

    const updatedUserData = {
      _id: user2._id,
      name: user2.name,
      cpf: user2.cpf,
      birthday: user2.birthday,
      email: userData1.email,
      password: 'newpassword',
      qualified: user2.qualified,
      cep: user2.cep,
      complement: user2.complement,
      neighborhood: user2.neighborhood,
      locality: user2.locality,
      uf: user2.uf,
    };

    await expect(updateUserService.execute(updatedUserData)).rejects.toThrow(
      BusinessError,
    );
    await expect(updateUserService.execute(updatedUserData)).rejects.toThrow(
      EMAIL_ALREADY_USED,
    );
  });

  it('Should not be possible to update for a user under 18 years', async () => {
    const userData = {
      name: 'Carla',
      cpf: '111.111.111-11',
      birthday: new Date('2020-01-01'),
      email: 'carla@example.com',
      password: 'password',
      qualified: 'yes' as Qualified,
      cep: '58000-000',
      complement: 'Apt. 1',
      neighborhood: 'Centro',
      locality: 'João Pessoa',
      uf: 'PB',
    };

    const createdUser = await userRepositoryInMemory.create(userData);

    const updatedUserData = {
      _id: createdUser._id,
      name: userData.name,
      cpf: userData.cpf,
      birthday: new Date('2019-01-01'),
      email: userData.email,
      password: userData.password,
      qualified: userData.qualified,
      cep: userData.cep,
      complement: userData.complement,
      neighborhood: userData.neighborhood,
      locality: userData.locality,
      uf: userData.uf,
    };

    await expect(updateUserService.execute(updatedUserData)).rejects.toThrow(
      BusinessError,
    );
    await expect(updateUserService.execute(updatedUserData)).rejects.toThrow(
      UNDERAGE_USER,
    );
  });
});
