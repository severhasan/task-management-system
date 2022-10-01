import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CustomJWTPayload } from '../controllers/auth/auth.login';

export interface CustomRequest extends Request {
  user: {
    id: number;
  };
}

export function authenticate(req: any, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;
    const decoded = <CustomJWTPayload>jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
}
