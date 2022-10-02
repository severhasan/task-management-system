import { Request, Response } from 'express';
import { TaskHistory } from 'src/database/mongo/entity/TaskHistory';
import { Task, TaskStatus } from '../../../database/postgres/entity/Task';
import { taskRepository } from '../../../database/postgres/postgres.data-source';
import { taskHistoryRepository } from '../../../database/mongo/mongo.data-source';

interface TaskWithHistory extends Task {
  history: TaskHistory[];
}

interface RequestQuery {
  assignedUser?: number;
  createdBy?: number;
  status?: TaskStatus;
}

export async function getTasks(req: Request, res: Response) {
  const { assignedUser, createdBy, status } = <RequestQuery>req.query;
  const query = taskRepository.createQueryBuilder();

  if (assignedUser) {
    query.andWhere('Task.assignedUserId = :assignedUserId', {
      assignedUserId: assignedUser,
    });
  }
  if (createdBy) {
    query.andWhere('Task.createdById = :createdBy', { createdBy });
  }
  if (status) {
    query.andWhere('Task.status = :status', { status });
  }
  query
    .leftJoin('Task.assignedUser', 'User')
    .select([
      'Task.id',
      'Task.title',
      'Task.assignedUser',
      'User.id',
      'User.fullname',
    ]);

  try {
    const tasks = await query.getMany();
    res.json({
      message: 'Tasks listed',
      tasks: tasks || [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

export async function getTaskById(req: Request, res: Response) {
  try {
    const id = +req.params.id;
    const query = taskRepository.createQueryBuilder();
    query
      .where({ id })
      .leftJoin('Task.assignedUser', 'AssignedUser')
      .leftJoin('Task.createdBy', 'User')
      .select([
        'Task.id',
        'Task.title',
        'AssignedUser.id',
        'AssignedUser.fullname',
        'User.id',
        'User.fullname',
      ]);

    const task = (await query.getOne()) as TaskWithHistory;
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }
    const history = await taskHistoryRepository.find({
      where: {
        taskId: id,
      },
      select: ['content'],
    });
    task.history = history;

    res.json({
      message: 'Task detail',
      task: task,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}
