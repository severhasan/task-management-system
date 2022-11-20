import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TaskHistory } from './entity/TaskHistory';

export const MongoDataSource = new DataSource({
  type: 'mongodb',
  host: process.env.MONGO_HOST || 'localhost',
  port: +process.env.MONGO_PORT || 27017,
  database: process.env.MONGO_DATABASE || 'tms-local-01',
  entities: [TaskHistory],
});

export const taskHistoryRepository = MongoDataSource.getRepository(TaskHistory);
