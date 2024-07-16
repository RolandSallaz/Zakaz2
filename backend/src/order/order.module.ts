import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModule } from '@/item/item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    JwtModule,
    UsersModule,
    ItemModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
