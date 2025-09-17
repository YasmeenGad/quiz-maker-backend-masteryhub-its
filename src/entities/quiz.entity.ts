import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

export type QuizType = 'MCQ' | 'TEXT';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column({ type: 'int' , nullable: true})
  year: number;

  @Column()
  start: Date;

  @Column({ type: 'enum', enum: ['MCQ', 'TEXT'], default: 'MCQ' })
  type: QuizType;

  @ManyToOne(() => User, (user) => user.quizzes)
  teacher: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
  questions: Question[];
}
