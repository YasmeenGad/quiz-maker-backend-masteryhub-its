import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';

@Injectable()
export class StudentQuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
  ) {}

  private isOpen(quiz: Quiz): boolean {
    const now = new Date();
    const start = new Date(quiz.start);
    const end = new Date(start.getTime() + quiz.duration * 60000);
    return now >= start && now <= end;
  }

  async listQuizzesForYear(year: number) {
    const quizzes = await this.quizRepo.find({
      where: { year },
      relations: ['teacher'],
      order: { start: 'ASC' },
    });

    return quizzes.map((q) => ({
      id: q.id,
      name: q.name,
      start: q.start,
      duration: q.duration,
      year: q.year,
      isOpen: this.isOpen(q),
      teacher: q.teacher ? { id: q.teacher.id, name: q.teacher.name } : null,
    }));
  }

  async getQuizForStudent(quizId: string, studentYear: number) {
  const quiz = await this.quizRepo.findOne({
    where: { id: quizId },
    relations: ['questions'],
  });
  if (!quiz) throw new NotFoundException('Quiz not found');

  if (Number(quiz.year) !== Number(studentYear)) {
    throw new ForbiddenException('Quiz not available for your year');
  }

  const questions = (quiz.questions || []).map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    options: q.options || [],
  }));

  return {
    id: quiz.id,
    name: quiz.name,
    start: quiz.start,
    duration: quiz.duration,
    year: quiz.year,
    isOpen: this.isOpen(quiz),
    questions,
  };
}

}
