import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Question } from '../quizzes/question.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'int' })
  durationMinutes: number; 

  @Column({ type: 'int' })
  year: number; 

  @ManyToOne(() => User, (user) => user.quizzes, { eager: true })
  teacher: User;

  @OneToMany(() => Question, (q) => q.quiz, { cascade: true, eager: true })
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
