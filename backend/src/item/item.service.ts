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
import { TGender } from '@/types';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    private itemsSelectorService: ItemSelectorsService,
  ) {}
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

  async find(find: string, gender?: TGender, type?: string) {
    const queryBuilder = this.itemRepository.createQueryBuilder('item');
    // Приводим `find` к нижнему регистру для корректного поиска
    const searchTerm = find.toLowerCase();
    // Условие для поиска по имени, описанию и типу
    if (searchTerm) {
      queryBuilder.andWhere(
        '(LOWER(item.name) LIKE :searchTerm OR LOWER(item.description) LIKE :searchTerm OR LOWER(item.type) LIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    // Фильтрация по гендеру, если оно указано
    if (gender) {
      queryBuilder.andWhere('item.gender = :gender', { gender });
    } else {
      // Если gender не передан, возвращаем unisex, male и female
      queryBuilder.andWhere('item.gender IN (:...genders)', {
        genders: ['unisex', 'male', 'female'],
      });
    }

    // Фильтрация по типу, если он указан
    if (type) {
      queryBuilder.andWhere('LOWER(item.type) = :type', {
        type: type.toLowerCase(),
      });
    }

    queryBuilder.take(20);
    // Получаем отфильтрованные элементы
    const items = await queryBuilder.getMany();

    return items;
  }

  async getByPages(
    itemsInPage: number,
    page: number = 1,
    filter?: 'new' | 'female' | 'male' | 'all',
  ) {
    const queryBuilder = this.itemRepository.createQueryBuilder('item');

    // Добавляем сортировку по дате, если filter === 'new'
    if (filter === 'new') {
      queryBuilder.orderBy('item.start_sell_date', 'DESC');
    }

    // Фильтруем по гендеру, если filter === 'female' или 'male'
    if (filter === 'female' || filter === 'male') {
      queryBuilder.andWhere('item.gender = :gender', { gender: filter });
    }

    // Получаем общее количество элементов с учетом фильтров
    const totalItems = await queryBuilder.getCount();

    // Пагинация
    const items = await queryBuilder
      .skip((page - 1) * itemsInPage)
      .take(itemsInPage)
      .getMany();

    // Вычисляем общее количество страниц
    const totalPages = Math.ceil(totalItems / itemsInPage);

    return {
      items,
      totalPages,
      currentPage: page,
      totalItems,
    };
  }
}
