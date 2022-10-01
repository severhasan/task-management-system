import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { PrimaryDataSource } from '../../../database/postgres/postgres.data-source';
import { User } from '../../../database/postgres/entity/User';
import { LoginRequestBody } from './auth.login';

interface RegisterRequestBody extends LoginRequestBody {
  firstname?: string;
  lastname?: string;
}

const userRepository = PrimaryDataSource.getRepository(User);

export async function register(req: Request, res: Response) {
  const body = <RegisterRequestBody>req.body;
  const userExists = await userRepository.findOneBy({ email: body.username });

  if (userExists) {
    return res.status(400).json({
      message: 'User with this email already exists',
    });
  }

  const password = await hashPassword(body.password);
  if (!password) {
    // Handle more gracefully
    return res.status(500).json({
      message: 'User could not be created',
    });
  }

  const user = new User();
  user.firstname = body.firstname || '';
  user.lastname = body.lastname || '';
  user.email = body.username;
  user.password = password;

  try {
    await userRepository.save(user);
    res.status(201).json({
      message: 'Created',
    });
  } catch (err) {
    console.log(err);
    // Handle more gracefully
    res.status(500).json({
      message: 'User could not be created',
    });
  }
}

async function hashPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.log(err);
    return null;
  }
}
