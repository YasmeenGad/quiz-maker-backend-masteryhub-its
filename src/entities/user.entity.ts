import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Submission } from '../entities/submission.entity';

export type UserRole = 'student' | 'teacher';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['student', 'teacher'] })
  role: UserRole;

  @Column({ type: 'int', nullable: false })
  year: number;

  @OneToMany(() => Quiz, (quiz) => quiz.teacher)
  quizzes: Quiz[];

  @OneToMany(() => Submission, (s) => s.student)
  submissions: Submission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
