import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { Quiz } from '../entities/quiz.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
  ) {}

  async submitQuiz(student: User, quizId: string, answers: { questionId: string; answer: string }[]) {
    const quiz = await this.quizRepo.findOne({
      where: { id: quizId },
      relations: ['questions'],
    });
    if (!quiz) throw new BadRequestException('Quiz not found');

    const now = new Date();
    const quizEnd = new Date(quiz.start.getTime() + quiz.duration * 60000);
    if (now < quiz.start || now > quizEnd) {
      throw new ForbiddenException('Quiz is not available at this time');
    }

    let score = 0;
    let needsManual = false;

    for (const q of quiz.questions) {
      const ans = answers.find((a) => a.questionId === q.id);
      if (!ans) continue;

      if (q.type === 'mcq') {
        if (Array.isArray(q.correctAnswer)) {
          if (
            Array.isArray(ans.answer) &&
            JSON.stringify(q.correctAnswer.sort()) === JSON.stringify((ans.answer as string[]).sort())
          ) {
            score += 1;
          }
        } else if (q.correctAnswer === ans.answer) {
          score += 1;
        }
      } else if (q.type === 'text') {
        needsManual = true;
      }
    }

    const submission = this.submissionRepo.create({
      student,
      quiz,
      answers,
      autoScore: needsManual ? null : score,
      needsManualGrading: needsManual,
    });

    return this.submissionRepo.save(submission);
  }

  async listStudentSubmissions(studentId: string) {
    return this.submissionRepo.find({ where: { student: { id: studentId } } });
  }
}
