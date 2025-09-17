import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { User } from '../entities/user.entity';
import { CreateQuizDto } from '../dto/create_quiz_dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
  ) {}

  async createQuiz(data: CreateQuizDto, teacher: User) {
    const quiz = this.quizRepo.create({
      name: data.name,
      duration: data.duration,
      start: new Date(data.start),
      year: data.year,
      teacher,
      questions: data.questions.map((q) => ({
        text: q.text,
        type: q.type,
        options: q.options || null,
        correctAnswer: q.correctAnswer || null,
      })),
    });
    return this.quizRepo.save(quiz);
  }

  async listTeacherQuizzes(teacherId: string) {
    return this.quizRepo.find({ where: { teacher: { id: teacherId } }, relations: ['questions'] });
  }

  async deleteQuiz(id: string, teacherId: string) {
    const quiz = await this.quizRepo.findOne({
      where: { id, teacher: { id: teacherId } },
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    await this.quizRepo.remove(quiz);
    return { success: true };
  }

  async getStudentQuizzes(year: number) {
    return this.quizRepo
      .createQueryBuilder('quiz')
      .innerJoinAndSelect('quiz.teacher', 'teacher')
      .where('quiz.year = :year', { year })
      .getMany();
  }
}
