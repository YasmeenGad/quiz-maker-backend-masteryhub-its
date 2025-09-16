import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from './quizzes.service';
import { QuizController } from './quizzes.controller';
import { Quiz } from '../../entities/quiz.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, User])],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizzesModule {}