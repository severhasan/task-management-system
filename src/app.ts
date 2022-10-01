import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './api/routes';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(router);

app.listen(PORT, () => {
  console.log('🚀 Listening on port %d', PORT);
});
