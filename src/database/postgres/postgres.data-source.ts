import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from './entity/Task';
import { User } from './entity/User';

export const PrimaryDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: [User, Task],
  migrations: [],
  subscribers: [],
});

export const userRepository = PrimaryDataSource.getRepository(User);
export const taskRepository = PrimaryDataSource.getRepository(Task);
