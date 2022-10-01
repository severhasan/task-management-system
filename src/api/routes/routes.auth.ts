import { Router } from 'express';
import { login, logout, register } from '../controllers/auth';
import { requestValidator } from '../middleware/middleware.validator';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/login',
  body('username').isEmail().withMessage('username must be a valid email'),
  body('password').exists().withMessage('password field cannot be empty'),
  requestValidator,
  login
);

router.post(
  '/register',
  body('username').isEmail().withMessage('username must be a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password length must be longer than 6'),
  requestValidator,
  register
);

router.post('/logout', logout);

export default router;
