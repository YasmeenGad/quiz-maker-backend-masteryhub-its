import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../../entities/quiz.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
  ) {}

  async createQuiz(data: Partial<Quiz>, teacher: User) {
    const quiz = this.quizRepo.create({ ...data, teacher });
    return this.quizRepo.save(quiz);
  }

  async listTeacherQuizzes(teacherId: string) {
    return this.quizRepo.find({ where: { teacher: { id: teacherId } } });
  }

  async deleteQuiz(id: string, teacherId: string) {
    const quiz = await this.quizRepo.findOne({ where: { id, teacher: { id: teacherId } } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    await this.quizRepo.remove(quiz);
    return { success: true };
  }

  async getStudentQuizzes(year: number) {
    return this.quizRepo
      .createQueryBuilder('quiz')
      .innerJoinAndSelect('quiz.teacher', 'teacher')
      .where('teacher.year = :year', { year })
      .getMany();
  }
}
