import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from './jwt.guard';

class RegisterDto {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  year: number;
}

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  private tokenBlacklist = new Set<string>(); // simple in-memory

  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: dto.role,
      year: dto.year ?? null,
    });
    delete (created as any).password;
    return created;
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new Error('Invalid credentials');
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const auth = req.headers?.authorization || '';
    const token = auth.replace('Bearer ', '');
    this.tokenBlacklist.add(token);
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return req.user;
  }
}
