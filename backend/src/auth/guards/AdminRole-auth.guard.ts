import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminRoleAuthGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Вызываем метод canActivate родительского класса (JwtAuthGuard)
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    // Проверяем роль пользователя
    if (user.role !== 'admin') {
      throw new ForbiddenException({ message: 'Недостаточно прав' });
    }

    return true;
  }
}
