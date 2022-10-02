import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import { CustomJWTPayload } from '../controllers/auth/auth.login';
import {
  redisClient,
  REDIS_JWT_INVALIDATION,
} from '../../database/redis/redis.client';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const cacheKey = REDIS_JWT_INVALIDATION + token;
    const isInvalidToken = await redisClient.get(cacheKey);
    if (isInvalidToken !== null) {
      console.log('invalidated token');
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const decoded = <CustomJWTPayload>jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
}
