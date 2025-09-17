import { Controller, Get, Param, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { StudentQuizService } from '../service/student_quiz.service';
import { StudentSubmissionsService } from '../service/student_submissions.service';
import { SubmitQuizDto } from '../dto/submit_quiz.dto';
import { BaseResponse } from '../dto/base_response_dto';
import { API_ROUTES } from '../constants/api_routes';

@Controller(API_ROUTES.QUIZ.ROOT)
@UseGuards(JwtAuthGuard)
export class StudentQuizController {
  constructor(
    private readonly studentQuizService: StudentQuizService,
    private readonly studentSubmissionsService: StudentSubmissionsService,
  ) {}

  @Get(API_ROUTES.QUIZ.STUDENT)
  async getQuizzesForStudent(@Req() req: any) {
    const year = req.user?.year;
    const data = await this.studentQuizService.listQuizzesForYear(year);
    return new BaseResponse(true, 'Quizzes for student fetched', data);
  }

  @Get(`${API_ROUTES.QUIZ.STUDENT}/:id`)
  async getQuizDetailsForStudent(@Param('id') id: string, @Req() req: any) {
    const year = req.user?.year;
    const data = await this.studentQuizService.getQuizForStudent(id, year);
    return new BaseResponse(true, 'Quiz details fetched', data);
  }

  @Post(`${API_ROUTES.QUIZ.STUDENT}/:id/submit`)
  async submitStudentQuiz(@Param('id') id: string, @Body() body: SubmitQuizDto, @Req() req: any) {
    const submission = await this.studentSubmissionsService.submitQuiz(req.user, id, body.answers || []);
    return new BaseResponse(true, 'Quiz submitted', submission);
  }
}
