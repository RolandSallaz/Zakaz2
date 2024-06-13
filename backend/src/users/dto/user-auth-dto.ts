import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UserAuthDto extends CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  code: number;
}
