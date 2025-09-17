import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { BaseResponse } from '../dto/base_response_dto';
import { BlacklistService } from './blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private blacklistService: BlacklistService,
  ) {}

  async register(dto: RegisterDto) {
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

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      return new BaseResponse(false, 'Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role };
    const tokenData = {
      access_token: this.jwtService.sign(payload),
      user,
    };

    return new BaseResponse(true, 'Login successful', tokenData);
  }

  async logout(token: string) {
    this.blacklistService.add(token);
    return new BaseResponse(true, 'Logout successful');
  }

  async getProfile(user: any) {
    return new BaseResponse(true, 'User fetched successfully', user);
  }
}
