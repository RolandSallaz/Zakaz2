import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { generateSixDigitCode } from 'src/common/helpers/codeGenerator';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({});
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneOrFail({ where: { email } });
  }

  async checkUser(email: string): Promise<{ message: string }> {
    await this.userRepository.findOneOrFail({
      where: { email },
    });
    return { message: 'Пользователь зарегистрирован' };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findUserOrCreate({ email }: CreateUserDto): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = this.userRepository.create({ email });
      await this.userRepository.save(user);
    }
    return user;
  }

  async updateUserAuth(user: User): Promise<number> {
    const newCode = generateSixDigitCode();
    user.authCode = newCode;
    await this.userRepository.save(user);
    return newCode;
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    return await this.userRepository.save({ ...user, ...dto });
  }
}
