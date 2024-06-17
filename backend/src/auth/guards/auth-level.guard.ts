import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  CanActivate,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { ROLES } from '../enums';

@Injectable()
export class AuthLevelGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    jwtService: JwtService,
    usersService: UsersService,
    private reflector: Reflector,
  ) {
    super(jwtService, usersService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }
    const { user } = context.switchToHttp().getRequest();
    const authLevel = this.reflector.get<ROLES>(
      'authLevel',
      context.getHandler(),
    );

    if (user.auth_level >= authLevel) {
      return true;
    } else {
      throw new ForbiddenException({ message: 'Недостаточно прав' });
    }
  }
}
