import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Quiz } from './quiz.entity';

export type QuestionType = 'mcq' | 'text';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quiz, (q) => q.questions, { onDelete: 'CASCADE' })
  quiz: Quiz;

  @Column()
  text: string;

  @Column({ type: 'enum', enum: ['mcq', 'text'] })
  type: QuestionType;

  @Column({ type: 'json', nullable: true })
  options: string[]; 

  @Column({ nullable: true })
  correctAnswer: string | null;
}
