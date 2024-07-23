import { sendMessageToAdmin } from '@/common/helpers/tgBotService';
import { ItemService } from '@/item/item.service';
import { User } from '@/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private itemService: ItemService,
    private configService: ConfigService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const order = await this.orderRepository.create(createOrderDto);
    order.customer_email = user.email;

    order.items = await this.itemService.findManyById(createOrderDto.itemsIds);

    const message = `
    Пользователь ${order.customer_email}\n
Телеграм ник: ${order.telegram}\n
Номер телефона: ${order.phone}\n
Оформил заказ на сумму: ${order.items.reduce((total, item) => total + item.price, 0)} руб\n
Товары: \n
${order.items.map((item) => `Имя: ${item.name} Цена: ${item.price} руб id: ${item.id} \n`)}`;
    try {
      await sendMessageToAdmin(message, this.configService);
    } catch (err) {
      order.is_error = true;
    }
    return await this.orderRepository.save(order);
  }

  async getMyOrders(user: User): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customer_email: user.email },
      relations: ['items'],
      order: {
        create_date: 'DESC',
      },
    });
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['items'],
      order: {
        create_date: 'DESC',
      },
    });
  }

  async updateOrder(id: number, updateDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOneOrFail({
      where: { id },
      relations: ['items'],
    });
    this.orderRepository.merge(order, updateDto);
    return await this.orderRepository.save(order);
  }
}
