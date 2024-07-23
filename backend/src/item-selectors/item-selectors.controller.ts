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
import { ItemSelectorsService } from './item-selectors.service';
import { CreateItemSelectorDto } from './dto/create-item-selector.dto';
import { UpdateItemSelectorDto } from './dto/update-item-selector.dto';
import { AuthLevel } from '@/auth/decorators/AuthLevel';
import { ROLES } from '@/auth/enums';
import { AuthLevelGuard } from '@/auth/guards/auth-level.guard';

@Controller('item-selectors')
export class ItemSelectorsController {
  constructor(private readonly itemSelectorsService: ItemSelectorsService) {}

  @Post()
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  create(@Body() createItemSelectorDto: CreateItemSelectorDto) {
    return this.itemSelectorsService.findOrCreate(createItemSelectorDto);
  }

  @Get()
  findAll() {
    return this.itemSelectorsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  findOne(@Param('id') id: string) {
    return this.itemSelectorsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateItemSelectorDto: UpdateItemSelectorDto,
  ) {
    return this.itemSelectorsService.update(+id, updateItemSelectorDto);
  }

  @Delete(':id')
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  remove(@Param('id') id: string) {
    return this.itemSelectorsService.remove(+id);
  }
}
