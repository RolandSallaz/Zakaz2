import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Item } from '../entities/item.entity';
import { TActiveTime, TGender } from '@/types';

export class CreateItemDto extends PartialType(Item) {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  active_time: TActiveTime;

  @IsArray()
  @IsString({ each: true }) // проверяет, что каждый элемент массива — строка
  @ArrayNotEmpty()       // (опционально) проверяет, что массив не пустой
  @ArrayMinSize(1)       // (опционально) требует минимум 1 элемент
  category: string[];

  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsBoolean()
  inStock?: boolean;
}
