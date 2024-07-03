import { AuthLevel } from '@/auth/decorators/AuthLevel';
import { CurrentUser } from '@/auth/decorators/CurrentUser';
import { ROLES } from '@/auth/enums';
import { AuthLevelGuard } from '@/auth/guards/auth-level.guard';
import { User } from '@/users/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  create(@Body() createItemDto: CreateItemDto, @Req() req: { user: User }) {
    const creatorEmail = req.user.email;
    return this.itemService.create(createItemDto, creatorEmail);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.itemService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
