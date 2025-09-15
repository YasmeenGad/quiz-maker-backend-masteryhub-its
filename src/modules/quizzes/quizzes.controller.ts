import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quizzes.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { API_ROUTES } from '../../constants/routes';

@Controller(API_ROUTES.QUIZ.ROOT)
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async createQuiz(@Body() data, @Req() req) {
    return this.quizService.createQuiz(data, req.user);
  }

  @Get(API_ROUTES.QUIZ.TEACHER)
  async listQuizzes(@Req() req) {
    return this.quizService.listTeacherQuizzes(req.user.id);
  }

  @Delete(':id')
  async deleteQuiz(@Param('id') id: string, @Req() req) {
    return this.quizService.deleteQuiz(id, req.user.id);
  }

  @Get(API_ROUTES.QUIZ.STUDENT)
  async getQuizzesForStudent(@Req() req) {
    return this.quizService.getStudentQuizzes(req.user.year);
  }
}
