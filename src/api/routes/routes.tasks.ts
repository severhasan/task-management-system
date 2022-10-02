import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTaskById,
} from '../controllers/tasks';
import { requestValidator } from '../middleware/middleware.validator';
import { body } from 'express-validator';
import { TaskStatus } from '../../database/postgres/entity/Task';

const router = Router();
const taskStatuses = [
  TaskStatus.COMPLETED,
  TaskStatus.IN_PROGRESS,
  TaskStatus.NEW,
].join('|');
const statusRegExp = new RegExp(taskStatuses);

router
  .get('/tasks', getTasks)
  .get('/tasks/:id', getTaskById)
  .post(
    '/tasks',
    body('title').isString().notEmpty().withMessage('title cannot be empty'),
    body('status')
      .matches(statusRegExp)
      .withMessage('status must be either "new", "in_progress" or "completed"')
      .optional(),
    body('assignedUser')
      .isNumeric()
      .isInt({ min: 0 })
      .withMessage(
        'assignedUser must be a valid number (id of the related task)'
      )
      .optional(),
    requestValidator,
    createTask
  )
  .patch(
    '/tasks/:id',
    body('title').isString().optional(),
    body('status').matches(statusRegExp).optional(),
    body('assignedUser').isNumeric().optional(),
    requestValidator,
    updateTaskById
  )
  .delete('/tasks/:id', deleteTask);

export default router;
