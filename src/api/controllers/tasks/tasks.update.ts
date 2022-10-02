import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { TaskStatus } from '../../../database/postgres/entity/Task';
import {
  taskRepository,
  userRepository,
} from '../../../database/postgres/postgres.data-source';
import { User } from '../../../database/postgres/entity/User';
import { taskHistoryRepository } from '../../../database/mongo/mongo.data-source';

interface UpdateRequestBody {
  status?: TaskStatus;
  assignedUser?: number;
  title?: string;
}

export async function updateTaskById(req: Request, res: Response) {
  const id = +req.params.id;
  const body = <UpdateRequestBody>matchedData(req, {
    onlyValidData: true,
    locations: ['body'],
    includeOptionals: true,
  });
  if (!body || !Object.values(body).length) {
    return res.status(400).json({
      message: 'Nothing to update',
    });
  }
  const task = await taskRepository.findOneBy({ id });
  if (!task) {
    return res.status(404).json({
      message: 'Task not found',
    });
  }

  if (task.assignedUser && task.assignedUser.id === body.assignedUser) {
    delete body.assignedUser;
  }
  if (body.title && body.title.trim() === task.title.trim()) {
    delete body.title;
  }
  if (body.status === task.status) {
    delete body.status;
  }

  let userToAssign: User;
  if (body.assignedUser) {
    userToAssign = await userRepository.findOneBy({ id: body.assignedUser });
    if (!userToAssign) {
      return res.status(404).json({
        message: 'Assigned user not found',
      });
    }
  }

  try {
    if (Object.keys(body).length) {
      await taskRepository.update(
        { id },
        {
          assignedUser: userToAssign || task.assignedUser,
          title: (body.title && body.title.trim()) || task.title,
          status: body.status || task.status,
        }
      );
    }

    if (body.assignedUser) {
      await taskHistoryRepository.save({
        taskId: task.id,
        content: `Task ["id=${task.id}"] was assigned to ${userToAssign.fullname} [id=${userToAssign.id}]`,
      });
    }
    if (body.title) {
      await taskHistoryRepository.save({
        taskId: task.id,
        content: `Task ["id=${task.id}"] was renamed as ${body.title}`,
      });
    }
    if (body.status) {
      await taskHistoryRepository.save({
        taskId: task.id,
        content: `Task ["id=${task.id}"] status was changed to ${body.status}`,
      });
    }

    res.status(200).json({
      message: 'Update successful',
      task: {
        id: task.id,
        title: body.title || task.title,
        assignedUser: {
          id: userToAssign ? userToAssign.id : task.assignedUser.id,
          fullname: userToAssign
            ? userToAssign.fullname
            : task.assignedUser.fullname,
        },
        status: body.status || task.status,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Bad Request',
    });
  }
}
