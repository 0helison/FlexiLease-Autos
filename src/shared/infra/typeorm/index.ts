import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'src/database/compacine.sqlite',
  entities: [],
  migrations: [],
  synchronize: true,
});

export { dataSource };
