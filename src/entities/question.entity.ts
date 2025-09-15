import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Quiz } from './quiz.entity';

export type QuestionType = 'mcq' | 'text';

@Entity('questions')
export class Question {

}
