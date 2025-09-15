import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quizzes.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { API_ROUTES } from '../../constants/routes';
import { BaseResponse } from '../../dto/base-response.dto';

@Controller(API_ROUTES.QUIZ.ROOT)
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async createQuiz(@Body() data, @Req() req) {
    const quiz = await this.quizService.createQuiz(data, req.user);
    return new BaseResponse(true, 'Quiz created successfully', quiz);
  }

  @Get(API_ROUTES.QUIZ.TEACHER)
  async listQuizzes(@Req() req) {
    const quizzes = await this.quizService.listTeacherQuizzes(req.user.id);
    return new BaseResponse(true, 'Teacher quizzes fetched', quizzes);
  }

  @Delete(':id')
  async deleteQuiz(@Param('id') id: string, @Req() req) {
    await this.quizService.deleteQuiz(id, req.user.id);
    return new BaseResponse(true, 'Quiz deleted successfully');
  }

  @Get(API_ROUTES.QUIZ.STUDENT)
  async getQuizzesForStudent(@Req() req) {
    const quizzes = await this.quizService.getStudentQuizzes(req.user.year);
    return new BaseResponse(true, 'Quizzes for student fetched', quizzes);
  }
}
