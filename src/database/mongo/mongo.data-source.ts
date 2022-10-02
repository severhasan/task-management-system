import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TaskHistory } from './entity/TaskHistory';

export const MongoDataSource = new DataSource({
  type: 'mongodb',
  host: process.env.MONGO_HOST,
  port: +process.env.MONGO_PORT,
  database: process.env.MONGO_DATABASE,
  entities: [TaskHistory],
});

export const taskHistoryRepository = MongoDataSource.getRepository(TaskHistory);
