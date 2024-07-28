import { UsersModule } from '@/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemSelector } from './entities/item-selector.entity';
import { ItemSelectorsController } from './item-selectors.controller';
import { ItemSelectorsService } from './item-selectors.service';
import { ItemModule } from '@/item/item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemSelector]),
    JwtModule,
    forwardRef(() => ItemModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ItemSelectorsController],
  providers: [ItemSelectorsService],
  exports: [ItemSelectorsService],
})
export class ItemSelectorsModule {}
