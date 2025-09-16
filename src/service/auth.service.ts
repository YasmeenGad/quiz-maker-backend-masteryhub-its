import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
