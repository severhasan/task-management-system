import { Request, Response } from 'express';
import { TaskHistory } from 'src/database/mongo/entity/TaskHistory';
import { Task, TaskStatus } from '../../../database/postgres/entity/Task';
import { taskRepository } from '../../../database/postgres/postgres.data-source';
import { taskHistoryRepository } from '../../../database/mongo/mongo.data-source';
import {
  DEFAULT_EXPIRATION,
  redisClient,
  REDIS_ALL_TASKS_PREFIX,
  REDIS_TASK_BY_ID_PREFIX,
} from '../../../database/redis/redis.client';

interface TaskWithHistory extends Task {
  history: TaskHistory[];
}

interface RequestQuery {
  assignedUser?: number;
  createdBy?: number;
  status?: TaskStatus;
}

export async function getTasks(req: Request, res: Response) {
  try {
    const cacheKey = generateTasksRedisKey(req.query);
    const cachedTasks = await redisClient.get(cacheKey);
    if (cachedTasks !== null) {
      console.log('cache hit');
      return res.json({
        message: 'Tasks listed',
        tasks: JSON.parse(cachedTasks),
      });
    }
    console.log('cache miss');

    const tasks = await getTasksFromDB(req.query);
    if (!tasks) {
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }

    redisClient.setEx(cacheKey, DEFAULT_EXPIRATION, JSON.stringify(tasks));

    res.json({
      message: 'Tasks listed',
      tasks,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

export async function getTaskById(req: Request, res: Response) {
  try {
    const id = +req.params.id;
    const cacheKey = REDIS_TASK_BY_ID_PREFIX + id;
    const cachedTask = await redisClient.get(cacheKey);
    if (cachedTask !== null) {
      console.log('cache hit');
      return res.json({
        message: 'Tasks listed',
        task: JSON.parse(cachedTask),
      });
    }

    console.log('cache miss');
    const task = await getTaskByIdFromDB(id);
    if (task === null) {
      return res.status(404).json({
        message: 'Task not found',
      });
    } else if (!task) {
      res.status(500).json({
        message: 'Internal Server Error',
      });
    }

    redisClient.setEx(cacheKey, DEFAULT_EXPIRATION, JSON.stringify(task));

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

async function getTasksFromDB(reqQuery: RequestQuery) {
  const { assignedUser, createdBy, status } = reqQuery;
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
    return (await query.getMany()) || [];
  } catch (err) {
    console.log(err);
    return null;
  }
}

function generateTasksRedisKey(reqQuery: RequestQuery) {
  const keys = Object.keys(reqQuery).sort();
  const keyname = keys
    .filter((key) => reqQuery[key])
    .map((key) => reqQuery[key])
    .join('-');
  return `${REDIS_ALL_TASKS_PREFIX}${keyname}`;
}

async function getTaskByIdFromDB(id: number) {
  try {
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
      return null;
    }
    const history = await taskHistoryRepository.find({
      where: {
        taskId: id,
      },
      select: ['content'],
      order: {
        createdAt: 'DESC',
      },
    });
    task.history = history;
    return task;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}
