import { ROLES } from '@/auth/enums';
import { ItemSelectorsService } from '@/item-selectors/item-selectors.service';
import { User } from '@/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays } from 'date-fns';
import { ILike, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    private itemsSelectorService: ItemSelectorsService,
  ) { }
  async create(
    createItemDto: CreateItemDto,
    creatorEmail: string,
  ): Promise<Item> {
    const { active_time, ...dto } = createItemDto;

    let end_sell_date: Date | null = null;

    if (active_time.toLowerCase() !== 'infinity') {
      const daysToAdd = parseInt(active_time, 10);
      if (isNaN(daysToAdd)) {
        throw new Error('Invalid active_time value');
      }
      const currentDate = new Date();
      end_sell_date = addDays(currentDate, daysToAdd);
    }
    await this.itemsSelectorService.findOrCreate({ name: dto.type });
    const item = await this.itemRepository.create({
      ...dto,
      end_sell_date,
      creator_email: creatorEmail,
    });
    return await this.itemRepository.save(item);
  }

  async findManyById(ids: number[]): Promise<Item[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.id IN (:...ids)', { ids })
      .getMany();
  }

  async findAll(user?: User): Promise<Item[]> {
    if (user?.auth_level >= ROLES.MANAGER) {
      return await this.itemRepository
        .createQueryBuilder('item')
        .addSelect('item.creator_email')
        .getMany();
    } else {
      return await this.itemRepository.find({});
    }
  }

  async findAllByUser(user: User): Promise<Item[]> {
    return await this.itemRepository.find({
      where: { creator_email: user.email },
    });
  }

  async findOne(id: number): Promise<Item> {
    return await this.itemRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.itemRepository.findOneOrFail({ where: { id } });
    this.itemRepository.merge(item, updateItemDto);
    return await this.itemRepository.save(item);
  }

  async remove(id: number): Promise<Item> {
    const item = await this.itemRepository.findOneOrFail({ where: { id } });
    return await this.itemRepository.remove(item);
  }

  async findByName(name: string): Promise<Item[]> {
    const items = await this.itemRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      take: 5,
    });
    return items;
  }
}
