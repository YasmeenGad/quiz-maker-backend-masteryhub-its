import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentQuizController } from '../controller/student_quiz.controller';
import { StudentQuizService } from '../service/student_quiz.service';
import { StudentSubmissionsService } from '../service/student_submissions.service';
import { Quiz } from '../entities/quiz.entity';
import { Submission } from '../entities/submission.entity';
import { Question } from '../entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Submission, Question])],
  controllers: [StudentQuizController],
  providers: [StudentQuizService, StudentSubmissionsService],
  exports: [StudentQuizService, StudentSubmissionsService],
})
export class StudentModule {}
