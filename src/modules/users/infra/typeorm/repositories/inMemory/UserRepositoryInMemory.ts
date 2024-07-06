import { IUsersRepository } from '@modules/users/domain/repositories/IUserRepository';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUser } from '@modules/users/domain/models/IUser';
import { IPaginateUser } from '@modules/users/domain/models/IPaginateUser';
import { ObjectId } from 'mongodb';
import { ISearchParamsList } from '@modules/users/domain/models/ISearchParamsList';

class UserRepositoryInMemory implements IUsersRepository {
  private users: IUser[] = [];

  public async findAll({
    limit,
    offset,
    name,
    cpf,
    email,
    birthday,
    qualified,
    cep,
    complement,
    neighborhood,
    locality,
    uf,
  }: ISearchParamsList): Promise<IPaginateUser> {
    let filteredUsers = this.users;

    if (name) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    if (cpf) {
      filteredUsers = filteredUsers.filter(user =>
        user.cpf.toLowerCase().includes(cpf.toLowerCase()),
      );
    }

    if (email) {
      filteredUsers = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(email.toLowerCase()),
      );
    }

    if (birthday) {
      filteredUsers = filteredUsers.filter(
        user =>
          user.birthday.toISOString() === new Date(birthday).toISOString(),
      );
    }

    if (qualified) {
      filteredUsers = filteredUsers.filter(user =>
        user.qualified?.toLowerCase().includes(qualified.toLowerCase()),
      );
    }

    if (cep) {
      filteredUsers = filteredUsers.filter(user =>
        user.cep?.toLowerCase().includes(cep.toLowerCase()),
      );
    }

    if (complement) {
      filteredUsers = filteredUsers.filter(user =>
        user.complement?.toLowerCase().includes(complement.toLowerCase()),
      );
    }

    if (neighborhood) {
      filteredUsers = filteredUsers.filter(user =>
        user.neighborhood?.toLowerCase().includes(neighborhood.toLowerCase()),
      );
    }

    if (locality) {
      filteredUsers = filteredUsers.filter(user =>
        user.locality?.toLowerCase().includes(locality.toLowerCase()),
      );
    }

    if (uf) {
      filteredUsers = filteredUsers.filter(user =>
        user.uf?.toLowerCase().includes(uf.toLowerCase()),
      );
    }

    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    return {
      users: paginatedUsers,
      limit,
      total: filteredUsers.length,
      offset,
      offsets: Math.ceil(filteredUsers.length / limit),
    };
  }

  public async findById(_id: ObjectId): Promise<IUser | null> {
    return this.users.find(user => user._id.equals(_id)) || null;
  }

  public async findByCpf(cpf: string): Promise<IUser | null> {
    return this.users.find(user => user.cpf === cpf) || null;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    return this.users.find(user => user.email === email) || null;
  }

  public async create(fields: ICreateUser): Promise<IUser> {
    const user: IUser = {
      _id: new ObjectId(),
      ...fields,
    } as IUser;

    this.users.push(user);

    return user;
  }

  public async save(user: IUser): Promise<IUser> {
    const findIndex = this.users.findIndex(findUser =>
      findUser._id.equals(user._id),
    );

    this.users[findIndex] = user;

    return user;
  }

  public async remove(user: IUser): Promise<void> {
    this.users = this.users.filter(u => !u._id.equals(user._id));
  }
}

export default UserRepositoryInMemory;
