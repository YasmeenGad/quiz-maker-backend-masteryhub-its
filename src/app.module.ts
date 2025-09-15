import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UsersModule, AuthModule, QuizzesModule, QuestionsModule],
  controllers: [AppController],
  providers: [AppService],
})

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',   
      port: 3306,
      username: 'root',  
      password: '1234', 
      database: 'quiz_maker',   
      entities: [ ],
      synchronize: true, 
      // add
    }),
     QuizzesModule, // add
      UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
