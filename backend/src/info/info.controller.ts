import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateInfoDto } from './dto/update-info.dto';
import { InfoService } from './info.service';
import { TInfoType } from '@/types';
import { AuthLevel } from '@/auth/decorators/AuthLevel';
import { ROLES } from '@/auth/enums';
import { AuthLevelGuard } from '@/auth/guards/auth-level.guard';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get(':infoType')
  findOne(@Param('infoType') infoType: TInfoType) {
    return this.infoService.findOne(infoType);
  }

  @Patch(':infoType')
  @UseGuards(AuthLevelGuard)
  @AuthLevel(ROLES.MANAGER)
  update(
    @Param('infoType') infoType: TInfoType,
    @Body() updateInfoDto: UpdateInfoDto,
  ) {
    return this.infoService.updateOrCreate(infoType, updateInfoDto);
  }
}
