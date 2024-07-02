import { IUsersRepository } from '@modules/users/domain/repositories/IUserRepository';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokenRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';
import { container } from 'tsyringe';
import '@modules/users/providers';
import { ICarRepository } from '@modules/cars/domain/repositories/ICarRepository';
import CarRepository from '@modules/cars/infra/typeorm/repositories/CarRepository';
import { IReserveRepository } from '@modules/reserve/domain/repositories/IReserveRepository';
import ReserveRepository from '@modules/reserve/infra/typeorm/repositories/ReserveRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<ICarRepository>('CarRepository', CarRepository);

container.registerSingleton<IReserveRepository>(
  'ReserveRepository',
  ReserveRepository,
);
