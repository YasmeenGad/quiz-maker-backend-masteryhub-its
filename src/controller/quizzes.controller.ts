import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from '../service/quizzes.service';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { API_ROUTES } from '../constants/api_routes';
import { BaseResponse } from '../dto/base_response_dto';
import { CreateQuizDto } from '../dto/create_quiz_dto';

@Controller(API_ROUTES.QUIZ.ROOT)
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async createQuiz(@Body() data: CreateQuizDto, @Req() req) {
    const quiz = await this.quizService.createQuiz(data, req.user);
    return new BaseResponse(true, 'Quiz created successfully', quiz);
  }

  @Get(API_ROUTES.QUIZ.TEACHER)
  async getTeacherQuizzes(@Req() req) {
    const quizzes = await this.quizService.listTeacherQuizzes(req.user.id);
    return new BaseResponse(true, 'Teacher quizzes fetched', quizzes);
  }

  @Delete(':id')
  async deleteQuiz(@Param('id') id: string, @Req() req) {
    await this.quizService.deleteQuiz(id, req.user.id);
    return new BaseResponse(true, 'Quiz deleted successfully');
  }

  @Get(API_ROUTES.QUIZ.STUDENT)
  async getStudentQuizzes(@Req() req) {
    const quizzes = await this.quizService.getStudentQuizzes(req.user.year);
    return new BaseResponse(true, 'Quizzes for student fetched', quizzes);
  }
}
