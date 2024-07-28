import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { generateSixDigitCode } from 'src/common/helpers/codeGenerator';
import { UpdateUserDto } from './dto/update-user.dto';
import { Item } from '@/item/entities/item.entity';
import { ItemService } from '@/item/item.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly itemService: ItemService,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    // Для каждого пользователя добавляем createdItems
    const usersWithItems = await Promise.all(
      users.map(async (user) => {
        const createdItems = await this.itemService.findAllByUser(user);
        return { ...user, createdItems };
      }),
    );

    return usersWithItems;
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
