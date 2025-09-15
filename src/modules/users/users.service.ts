import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(input: Partial<User>) {
    const u = this.repo.create(input);
    return this.repo.save(u);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string) {
    return this.repo.createQueryBuilder('u').addSelect('u.password').where('u.email = :email', { email }).getOne();
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
