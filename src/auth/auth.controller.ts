import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/schemas/user.schema'; // Make sure User and other types are correctly imported
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: any; // Adjust this type according to your application's user type
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Req() req: AuthenticatedRequest): Promise<{ accessToken: string }> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    return this.authService.register(createUserDto);
  }
}
