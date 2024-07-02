import { Repository } from 'typeorm';
import { dataSource } from '@shared/infra/typeorm';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokenRepository';
import { UserToken } from '../entities/UserToken';
import { ObjectId } from 'mongodb';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = dataSource.getMongoRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = await this.ormRepository.findOneBy({ token });
    return userToken;
  }

  public async generate(user_id: ObjectId): Promise<UserToken> {
    const userToken = this.ormRepository.create({ user_id });
    await this.ormRepository.save(userToken);
    return userToken;
  }
}

export default UserTokensRepository;
