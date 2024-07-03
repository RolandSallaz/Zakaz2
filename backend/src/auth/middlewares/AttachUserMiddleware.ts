import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AttachUserMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authorizationHeader.replace('Bearer ', '');

    try {
      const { user } = this.jwtService.verify(token);
      const findUser = await this.usersService.findUserByEmail(user.email);

      req.user = findUser || null;
    } catch {
      req.user = null;
    }

    next();
  }
}
