import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private userService: UsersService;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.userService = usersService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Используем тип Promise<boolean> для асинхронной логики
    const req = context.switchToHttp().getRequest();
    try {
      if (!req.headers.authorization.startsWith('Bearer ')) {
        throw new UnauthorizedException({ message: 'Авторизация не прошла' });
      }
      const token = req.headers.authorization.replace('Bearer ', '');
      const { user } = this.jwtService.verify(token);
      const findUser = await this.userService.findUserByEmail(user.email);
      if (!findUser) {
        throw new UnauthorizedException({ message: 'Авторизация не прошла' });
      }
      req.user = findUser;
      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: 'Авторизация не прошла' });
    }
  }
}
