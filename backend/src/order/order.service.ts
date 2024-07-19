import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { ItemService } from '@/item/item.service';
import { ConfigService } from '@nestjs/config';
import { sendMessageToAdmin } from '@/common/helpers/tgBotService';

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
    const createdOrder = await this.orderRepository.save(order);
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
      //todo обработать ошибку тг
    }

    return createdOrder;
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

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
