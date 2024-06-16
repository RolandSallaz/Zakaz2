import { HttpException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { sendEmailCode } from 'src/common/helpers/emailService';
import { AuthenticatedRequest, IAuthData } from 'src/types';
import { UserAuthDto } from 'src/users/dto/user-auth-dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    @Inject(REQUEST) private request: AuthenticatedRequest,
  ) {}
  async getUserAndSendAuthCode({
    email,
  }: {
    email: string;
  }): Promise<{ message: string }> {
    const user = await this.userService.findUserOrCreate({ email });
    const code = await this.userService.updateUserAuth(user);
    return sendEmailCode({ email, code })
      .then(() => ({
        message: 'Сообщение отправлено успешно',
      }))
      .catch((err) => {
        throw new HttpException(`Ошибка почтового сервиса ${err}`, 500);
      });
  }

  async login(dto: UserAuthDto): Promise<IAuthData> {
    const user = await this.userService.findUserByEmail(dto.email);
    const authData = { user, token: null };
    if (user.authCode != dto.code) {
      throw new HttpException('Введен неверный код', 401);
    }
    const token = await this.jwtService.signAsync(authData);
    authData.token = token;
    return authData;
  }

  async checkAuth(): Promise<User> {
    return await this.userService.findUserByEmail(this.request.user.email);
  }
}
