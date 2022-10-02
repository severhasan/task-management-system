import { createClient } from 'redis';

export const DEFAULT_EXPIRATION = 3600;
export const REDIS_ALL_TASKS_PREFIX = 'tasks:all';
export const REDIS_TASK_BY_ID_PREFIX = 'tasks:by-id-';
export const REDIS_JWT_INVALIDATION = 'jwt:';

export const redisClient = createClient({ url: process.env.REDIS_HOST });
redisClient.on('error', (err) => console.log('Redis Client Error', err));

export async function deleteKeysByPrefix(prefix: string) {
  for await (const key of redisClient.scanIterator({
    TYPE: 'string',
    MATCH: prefix + '*',
    COUNT: 100,
  })) {
    redisClient.unlink(key);
  }
}
