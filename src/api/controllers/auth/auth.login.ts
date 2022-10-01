import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { PrimaryDataSource } from '../../../database/postgres/postgres.data-source';
import { User } from '../../../database/postgres/entity/User';
import jwt from 'jsonwebtoken';

export interface CustomJWTPayload {
  user: {
    id: number;
  };
}

export interface LoginRequestBody {
  password: string;
  username: string;
}

const userRepository = PrimaryDataSource.getRepository(User);

export async function login(req: Request, res: Response) {
  const body = <LoginRequestBody>req.body;
  const user = await userRepository.findOneBy({ email: body.username });

  if (!user) {
    return res.status(400).json({
      message: 'Username or password is invalid',
    });
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({
      message: 'Username or password is invalid',
    });
  }

  const payload: CustomJWTPayload = {
    user: { id: user.id },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({
    token: token,
  });
}
