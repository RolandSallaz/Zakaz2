import { AuthLevel } from '@/auth/decorators/AuthLevel';
import { ROLES } from '@/auth/enums';
import { AuthLevelGuard } from '@/auth/guards/auth-level.guard';
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  getAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.ADMIN)
  updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Get(':email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.checkUser(email);
  }
}
