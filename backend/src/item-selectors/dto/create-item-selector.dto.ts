import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItemSelectorDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
