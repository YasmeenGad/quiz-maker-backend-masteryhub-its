import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { API_ROUTES } from '../constants/api_routes';

@Controller(API_ROUTES.AUTH.ROOT)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(API_ROUTES.AUTH.REGISTER)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post(API_ROUTES.AUTH.LOGIN)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(API_ROUTES.AUTH.LOGOUT)
  async logout(@Request() req: any) {
    const auth = req.headers?.authorization || '';
    const token = auth.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_ROUTES.AUTH.PROFILE)
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user);
  }
}
