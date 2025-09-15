import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { SubmissionsModule } from './submissions/submissions.module';

import { User } from './users/user.entity';
import { Quiz } from './quizzes/quiz.entity';
import { Question } from './quizzes/question.entity';
import { Option } from './quizzes/option.entity';
import { Submission } from './submissions/submission.entity';
import { Answer } from './submissions/answer.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Quiz, Question, Option, Submission, Answer],
      synchronize: true, // dev only — use migrations in prod
    }),
    AuthModule,
    UsersModule,
    QuizzesModule,
    SubmissionsModule,
  ],
})
export class AppModule {}
