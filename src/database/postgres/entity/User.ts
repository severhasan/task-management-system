import {
  Column,
  CreateDateColumn,
  Index,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './Task';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Index()
  @Column()
  email: number;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.createdBy)
  tasks: Task[];

  @OneToMany(() => Task, (task) => task.createdBy)
  assignedTasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
