import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { Quiz } from '../entities/quiz.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class StudentSubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
  ) {}

  private isInWindow(quiz: Quiz) {
    const now = new Date();
    const start = new Date(quiz.start);
    const end = new Date(start.getTime() + quiz.duration * 60000);
    return now >= start && now <= end;
  }

  async submitQuiz(student: User, quizId: string, answers: { questionId: string; answer: any }[]) {
    const quiz = await this.quizRepo.findOne({
      where: { id: quizId },
      relations: ['questions'],
    });
    if (!quiz) throw new BadRequestException('Quiz not found');

    if (!this.isInWindow(quiz)) {
      throw new ForbiddenException('Quiz is not available at this time');
    }

    let correctCount = 0;
    let totalAuto = 0;
    let needsManual = false;

    for (const q of quiz.questions || []) {
      const userAns = answers.find((a) => a.questionId === q.id);
      if (!userAns) continue;

      if (q.type === 'mcq') {
        totalAuto++;
        if (Array.isArray(q.correctAnswer)) {
          if (Array.isArray(userAns.answer)) {
            const correctSorted = [...q.correctAnswer].sort();
            const ansSorted = [...userAns.answer].sort();
            if (JSON.stringify(correctSorted) === JSON.stringify(ansSorted)) correctCount++;
          }
        } else {
          if (userAns.answer === q.correctAnswer) correctCount++;
        }
      } else if (q.type === 'text') {
        needsManual = true;
      }
    }

    const autoScore = totalAuto > 0 ? (correctCount / totalAuto) * 100 : null;

    const submission = this.submissionRepo.create({
      student,
      quiz,
      answers,
      autoScore,
      needsManualGrading: needsManual,
    });

    return this.submissionRepo.save(submission);
  }

  async listStudentSubmissions(studentId: string) {
    return this.submissionRepo.find({
      where: { student: { id: studentId } },
      order: { submittedAt: 'DESC' },
      relations: ['quiz'],
    });
  }
}
