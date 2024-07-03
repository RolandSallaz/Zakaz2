import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private userService: UsersService;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
    this.userService = usersService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Используем тип Promise<boolean> для асинхронной логики
    const req = context.switchToHttp().getRequest();
    if (!req.user) {
      throw new UnauthorizedException({ message: 'Авторизация не прошла' });
    }
    return true;
  }
}
