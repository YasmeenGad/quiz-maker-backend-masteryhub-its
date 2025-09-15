import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from './jwt.guard';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { BlacklistService } from './blacklist.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private blacklistService: BlacklistService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: dto.role,
      year: dto.year,
    });
    delete (created as any).password;
    return created;
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const auth = req.headers?.authorization || '';
    const token = auth.replace('Bearer ', '');
    this.blacklistService.add(token);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return req.user;
  }
}
