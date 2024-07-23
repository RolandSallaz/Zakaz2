import { CurrentUser } from '@/auth/decorators/CurrentUser';
import { User } from '@/users/entities/user.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { AuthLevel } from '@/auth/decorators/AuthLevel';
import { ROLES } from '@/auth/enums';
import { AuthLevelGuard } from '@/auth/guards/auth-level.guard';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: User) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  findAll() {
    return this.orderService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  updateOrder(@Param('id') id: number, @Body() updateDto: UpdateOrderDto) {
    return this.orderService.updateOrder(id, updateDto);
  }

  @Get('/my-orders')
  getUserOrders(@CurrentUser() user: User) {
    return this.orderService.getMyOrders(user);
  }
}
