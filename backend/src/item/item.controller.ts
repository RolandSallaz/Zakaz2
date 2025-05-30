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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemService } from './item.service';
import { TGender } from '@/types';
import { FindItemQueryDto } from './dto/find-item.query.dto';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }

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

  @Get('/with-pagination')
  getItemsByPage(
    @Query('itemsInPage') itemsInPage: number = 8, // Установите значение по умолчанию, если нужно
    @Query('page') page: number = 1, // Значение по умолчанию для номера страницы
    @Query('filter') filter: 'new' | 'female' | 'male',
  ) {
    return this.itemService.getByPages(itemsInPage, page, filter);
  }

  @Get('/by-name/:name')
  findByName(@Param('name') name: string) {
    return this.itemService.findByName(name);
  }

  @Get('/search')
  search(
    @Query() query: FindItemQueryDto,
  ) {
    return this.itemService.find(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Get('/actual/:itemsIdArray')
  getActualItems(@Param('itemsIdArray') itemsIdArray: string) {
    const ids = JSON.parse(itemsIdArray);
    return this.itemService.findManyById(ids);
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
