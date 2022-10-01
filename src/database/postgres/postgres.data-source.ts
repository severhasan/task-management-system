import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from './entity/Task';
import { User } from './entity/User';

export const PrimaryDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: +process.env.PG_PORT,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Task],
  migrations: [],
  subscribers: [],
});
