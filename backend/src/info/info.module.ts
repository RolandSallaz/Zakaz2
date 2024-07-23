import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Info } from './entities/info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Info]), JwtModule, UsersModule],
  controllers: [InfoController],
  providers: [InfoService],
})
export class InfoModule {}
