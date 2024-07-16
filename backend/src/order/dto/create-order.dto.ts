import { PartialType } from '@nestjs/mapped-types';
import { Order } from '../entities/order.entity';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateOrderDto extends PartialType(Order) {
  @IsNotEmpty()
  telegram: string;
  @IsNotEmpty()
  phone: string;
  @IsArray()
  itemsIds: number[];
}
