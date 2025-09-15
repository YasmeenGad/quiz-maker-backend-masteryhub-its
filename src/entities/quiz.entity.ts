import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export type QuizType = 'MCQ' | 'TEXT';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number; // in minutes

  @Column()
  start: Date;

  @Column({ type: 'enum', enum: ['MCQ', 'TEXT'], default: 'MCQ' })
  type: QuizType;

  @ManyToOne(() => User, user => user.quizzes)
  teacher: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
