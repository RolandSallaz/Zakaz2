import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemSelector } from './entities/item-selector.entity';
import { ItemSelectorsController } from './item-selectors.controller';
import { ItemSelectorsService } from './item-selectors.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemSelector]), JwtModule, UsersModule],
  controllers: [ItemSelectorsController],
  providers: [ItemSelectorsService],
  exports: [ItemSelectorsService],
})
export class ItemSelectorsModule {}
