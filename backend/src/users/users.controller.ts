import { AuthLevel } from '@/auth/decorators/AuthLevel';
import { ROLES } from '@/auth/enums';
import { AuthLevelGuard } from '@/auth/guards/auth-level.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.checkUser(email);
  }
}
