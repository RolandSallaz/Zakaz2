import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { sendEmailCode } from 'src/common/helpers/emailService';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserAuthDto } from 'src/users/dto/user-auth-dto';

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
