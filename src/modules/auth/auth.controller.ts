import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from './jwt.guard';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { BlacklistService } from './blacklist.service';
import { BaseResponse } from 'src/dto/base-response.dto';
import { API_ROUTES } from '../../constants/routes';

@Controller(API_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private blacklistService: BlacklistService,
  ) {}

  @Post(API_ROUTES.AUTH.REGISTER)
  async register(@Body() dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      return new BaseResponse(false, 'Email already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: dto.role,
      year: dto.year,
    });
    delete (created as any).password;

    return new BaseResponse(true, 'User created successfully', created);
  }

  @Post(API_ROUTES.AUTH.LOGIN)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      return new BaseResponse(false, 'Invalid credentials');
    }
    const tokenData = await this.authService.login(user);
    return new BaseResponse(true, 'Login successful', tokenData);
  }
  @UseGuards(JwtAuthGuard)
  @Post(API_ROUTES.AUTH.LOGOUT)
  async logout(@Request() req: any) {
    const auth = req.headers?.authorization || '';
    const token = auth.replace('Bearer ', '');
    this.blacklistService.add(token);
    return new BaseResponse(true, 'Logout successful');
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_ROUTES.AUTH.ME)
  me(@Request() req: any) {
    return new BaseResponse(true, 'User fetched successfully', req.user);
  }
}
