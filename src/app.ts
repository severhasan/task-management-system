import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello world');
});

app.listen(PORT, () => {
  console.log('🚀 Listening on port %d', PORT);
});
