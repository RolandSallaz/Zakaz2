import { PartialType } from '@nestjs/mapped-types';
import {
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

  @IsBoolean()
  is_active: boolean;

  @IsString()
  gender: TGender;

  @IsString()
  type: string;

  @IsString()
  main_image: string;

  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
