import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { SubmissionsService } from '../service/submissions.service';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { BaseResponse } from '../dto/base_response_dto';
import { API_ROUTES } from '../constants/api_routes';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post(':quizId')
  async submitQuiz(@Param('quizId') quizId: string, @Body() body: any, @Req() req) {
    const submission = await this.submissionsService.submitQuiz(req.user, quizId, body.answers);
    return new BaseResponse(true, 'Quiz submitted successfully', submission);
  }

  @Get('my')
  async getMySubmissions(@Req() req) {
    const subs = await this.submissionsService.listStudentSubmissions(req.user.id);
    return new BaseResponse(true, 'My submissions fetched', subs);
  }
}
