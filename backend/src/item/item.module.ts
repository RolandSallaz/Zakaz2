import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { JwtModule } from '@nestjs/jwt';
import { Item } from './entities/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { ItemSelectorsModule } from '@/item-selectors/item-selectors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    JwtModule,
    UsersModule,
    ItemSelectorsModule,
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
