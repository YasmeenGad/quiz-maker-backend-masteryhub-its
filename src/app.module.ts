import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { User } from './users/user.entity';
import { Quiz } from './quizzes/quiz.entity';
import { Question } from './quizzes/question.entity';
import { Submission } from './submissions/submission.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'quiz_maker',
      entities: [User, Quiz, Question, Submission],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    QuizzesModule,
  ],
})
export class AppModule {}
