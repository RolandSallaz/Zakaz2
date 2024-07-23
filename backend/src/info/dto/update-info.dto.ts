import { IsString, MinLength } from 'class-validator';

export class UpdateInfoDto {
  @IsString()
  @MinLength(2)
  value?: string;
}
