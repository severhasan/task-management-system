import { Router, Request, Response } from 'express';
import { login, logout, register } from '../controllers/auth';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTaskById,
} from '../controllers/tasks';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.send('Hello world');
});

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);

router
  .get('/tasks', getTasks)
  .get('/tasks/:id', getTaskById)
  .post('tasks', createTask)
  .patch('tasks/:id', updateTaskById)
  .delete('tasks/:id', deleteTask);

export default router;
