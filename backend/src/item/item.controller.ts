import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthLevel } from '@/auth/decorators/AuthLevel';
import { ROLES } from '@/auth/enums';
import { AuthLevelGuard } from '@/auth/guards/auth-level.guard';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
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
