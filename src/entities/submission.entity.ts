import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Quiz } from './quiz.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.submissions, { eager: true })
  student: User;

  @ManyToOne(() => Quiz, { eager: true })
  quiz: Quiz;

  @Column({ type: 'json' })
  answers: { questionId: string; answer: string }[]; 

  @Column({ type: 'float', nullable: true })
  autoScore: number | null; 

  @Column({ default: false })
  needsManualGrading: boolean;

  @CreateDateColumn()
  submittedAt: Date;
}
