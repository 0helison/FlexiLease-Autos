import { DataSource } from 'typeorm';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { UserToken } from '@modules/users/infra/typeorm/entities/UserToken';
import { Car } from '@modules/cars/infra/typeorm/entities/Cars';
import { Reserve } from '@modules/reserve/infra/typeorm/entities/Reserve';

export const dataSource = new DataSource({
  type: 'mongodb',
  database: 'api',
  synchronize: true,
  host: 'localhost',
  port: 27017,
  entities: [UserToken, User, Car, Reserve],
});
