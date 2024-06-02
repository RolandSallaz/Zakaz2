import { generateSixDigitCode } from '@/common/filters/helpers/codeGenerator';
import { AuthenticatedRequest, IAuthData } from '@/types';
import { AuthUserDto } from '@/users/dto/auth-user.dto';
import { CreateOrFindUserDto } from '@/users/dto/createOrFind-user.dto';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
    @Inject(REQUEST) private request: AuthenticatedRequest,
  ) {}
  async findUserAndSendCode({
    email,
  }: CreateOrFindUserDto): Promise<{ message: string }> {
    const authCode = generateSixDigitCode(); //генерируем код
    const authDto: AuthUserDto = { email, authCode };

    const user = await this.userService.findUserOrCreate({ email }); //ищем пользователя
    await this.userService.updateAuthCode(authDto);
    await this.emailService.sendEmailAuthCode(authDto); //отправляем код на емейл
    return { message: `Код отправлен на емейл ${email}, проверьте папку СПАМ` };
  }

  async login({ email, authCode }: AuthUserDto): Promise<IAuthData> {
    const user = await this.userService.findUserOrCreate({ email });
    const authData = { user, token: null };
    if (user.authCode == authCode) {
      const token = await this.jwtService.signAsync(authData);
      authData.token = token;
      return authData;
    } else {
      throw new HttpException('Неверный код', 401);
    }
  }

  async checkAuth(): Promise<User> {
    return this.request.user;
  }
}
