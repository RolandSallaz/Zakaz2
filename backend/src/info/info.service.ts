import { TInfoType } from '@/types';
import { Injectable } from '@nestjs/common';
import { UpdateInfoDto } from './dto/update-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Info } from './entities/info.entity';

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(Info)
    private infoRepository: Repository<Info>,
  ) {}
  async findOne(infoType: TInfoType): Promise<Info> {
    return await this.infoRepository.findOne({
      where: { key: infoType },
    });
  }

  async updateOrCreate(
    infoType: TInfoType,
    updateInfoDto: UpdateInfoDto,
  ): Promise<Info> {
    let info = await this.findOne(infoType);
    if (!info) {
      info = await this.infoRepository.create();
      info.key = infoType;
    }
    info.value = updateInfoDto.value;
    return await this.infoRepository.save(info);
  }
}
