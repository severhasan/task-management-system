import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './api/routes';
import { PrimaryDataSource } from './database/postgres/postgres.data-source';
import { MongoDataSource } from './database/mongo/mongo.data-source';

const PORT = process.env.PORT || 3000;

const startApp = async () => {
  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.use(cors());
  app.use(router);

  try {
    await PrimaryDataSource.initialize();
    await MongoDataSource.initialize();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('🚀 Listening on port %d', PORT);
  });
};

export { startApp };
