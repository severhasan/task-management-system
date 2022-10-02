import { Request, Response } from 'express';
import { taskRepository } from '../../../database/postgres/postgres.data-source';

export async function deleteTask(req: Request, res: Response) {
  const id = +req.params.id;
  try {
    const task = await taskRepository.findOneBy({ id });
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }
    if (task.createdBy.id !== req.user.id) {
      return res.status(403).json({
        message: 'User does not have permissions to delete this task',
      });
    }

    const deleted = await taskRepository.delete({ id: id });
    if (deleted.affected === 1) {
      return res.json({
        message: 'Deleted task successfully.',
      });
    }
    res.status(500).json({
      message: 'There was a problem deleting the task',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}
