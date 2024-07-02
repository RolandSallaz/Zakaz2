import { Injectable } from '@nestjs/common';
import { CreateItemSelectorDto } from './dto/create-item-selector.dto';
import { UpdateItemSelectorDto } from './dto/update-item-selector.dto';
import { ItemSelector } from './entities/item-selector.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemSelectorsService {
  constructor(
    @InjectRepository(ItemSelector)
    private itemSelectorRepository: Repository<ItemSelector>,
  ) {}
  async findOrCreate(
    createItemSelectorDto: CreateItemSelectorDto,
  ): Promise<ItemSelector> {
    const item = await this.itemSelectorRepository.findOne({
      where: { name: createItemSelectorDto.name },
    });
    if (item) {
      return item;
    } else {
      const itemSelect = await this.itemSelectorRepository.create(
        createItemSelectorDto,
      );
      return await this.itemSelectorRepository.save(itemSelect);
    }
  }

  async findAll(): Promise<ItemSelector[]> {
    return await this.itemSelectorRepository.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} itemSelector`;
  }

  update(id: number, updateItemSelectorDto: UpdateItemSelectorDto) {
    return `This action updates a #${id} itemSelector`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemSelector`;
  }
}
