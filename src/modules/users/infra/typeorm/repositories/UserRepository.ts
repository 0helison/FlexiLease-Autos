import { Repository } from 'typeorm';
import { dataSource } from '@shared/infra/typeorm';
import { IUsersRepository } from '@modules/users/domain/repositories/IUserRepository';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUser } from '@modules/users/domain/models/IUser';
import { User } from '../entities/User';
import { IPaginateUser } from '@modules/users/domain/models/IPaginateUser';

import { ObjectId } from 'mongodb';
import { ISearchParamsList } from '@modules/users/domain/models/ISearchParamsList';

interface SearchParams {
  limit: number;
  offset: number;
}

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = dataSource.getMongoRepository(User);
  }

  public async findAll({
    limit,
    offset,
  }: SearchParams): Promise<IPaginateUser> {
    const [users, count] = await this.ormRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    const result: IPaginateUser = {
      users,
      limit,
      total: count,
      offset,
      offsets: Math.ceil(count / limit),
    };

    return result;
  }

  public async findById(_id: ObjectId): Promise<IUser | null> {
    const user = await this.ormRepository.findOne({
      where: {
        _id,
      },
    });

    return user || null;
  }

  public async findByCpf(cpf: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOne({
      where: {
        cpf,
      },
    });

    return user;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  public async create({
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
    const user = this.ormRepository.create({
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
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: IUser): Promise<IUser> {
    await this.ormRepository.save(user);

    return user;
  }

  public async remove(user: IUser): Promise<void> {
    await this.ormRepository.remove(user);
  }
}

export default UsersRepository;
