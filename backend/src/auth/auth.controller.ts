import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAuthDto } from 'src/users/dto/user-auth-dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('code')
  @HttpCode(200)
  sendEmailCode(@Body() dto: { email: string }) {
    return this.authService.getUserAndSendAuthCode(dto);
  }

  @Post()
  @HttpCode(200)
  login(@Body() authDto: UserAuthDto) {
    return this.authService.login(authDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  checkAuth() {
    return this.authService.checkAuth();
  }
}
