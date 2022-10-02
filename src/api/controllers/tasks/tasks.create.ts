import { Request, Response } from 'express';
import { Task } from '../../../database/postgres/entity/Task';
import {
  taskRepository,
  userRepository,
} from '../../../database/postgres/postgres.data-source';
import { TaskStatus } from '../../../database/mongo/entity/TaskHistory';

interface TaskRequestBody {
  title: string;
  assignedUser?: number;
  status?: TaskStatus;
}

export async function createTask(req: Request, res: Response) {
  const body = <TaskRequestBody>req.body;
  const user = await userRepository.findOneBy({ id: req.user.id });
  if (!user) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  const assignedUser =
    body.assignedUser &&
    (await userRepository.findOneBy({ id: body.assignedUser }));

  if (body.assignedUser && !assignedUser) {
    return res.status(400).json({
      message: 'Assigned user was not found',
    });
  }

  try {
    const task = (await taskRepository.save({
      title: body.title,
      createdBy: user,
      assignedUser: assignedUser || null,
      status: body.status || TaskStatus.NEW,
    })) as Task;
    res.status(201).json({
      message: 'Created',
      task: {
        id: task.id,
        title: task.title,
        assignedUser: assignedUser ? assignedUser.fullname : null,
        status: task.status,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Bad Request',
    });
  }
}
