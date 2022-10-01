import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

export enum TaskStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity()
export class TaskHistory {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @Index()
  @Column()
  taskId: number;

  @CreateDateColumn()
  createdAt: Date;
}
