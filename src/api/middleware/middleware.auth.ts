import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import { CustomJWTPayload } from '../controllers/auth/auth.login';

export function authenticate(req: Request, res: Response, next: NextFunction) {
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
