import { PartialType } from '@nestjs/mapped-types';
import { Order } from '../entities/order.entity';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateOrderDto extends PartialType(Order) {
  @IsString()
  telegram?: string;
  @IsString()
  phone?: string;
  @IsString()
  customer_email?: string;
  @IsBoolean()
  is_error?: boolean;
}
