import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTaskById,
} from '../controllers/tasks';

const router = Router();

router
  .get('/tasks', getTasks)
  .get('/tasks/:id', getTaskById)
  .post('tasks', createTask)
  .patch('tasks/:id', updateTaskById)
  .delete('tasks/:id', deleteTask);

export default router;
