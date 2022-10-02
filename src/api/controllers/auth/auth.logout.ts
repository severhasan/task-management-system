import { Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import {
  redisClient,
  REDIS_JWT_INVALIDATION,
} from '../../../database/redis/redis.client';

export function logout(req: Request, res: Response) {
  res.json({ message: 'OK' });

  const token = req.headers.authorization;
  if (token) {
    try {
      const payload = <JwtPayload>verify(token, process.env.JWT_SECRET);
      const expiration = payload.exp * 1000 - Date.now();
      const cacheKey = REDIS_JWT_INVALIDATION + token;

      redisClient.setEx(cacheKey, expiration, '');
    } catch (err) {
      console.log(err);
    }
  }
}
