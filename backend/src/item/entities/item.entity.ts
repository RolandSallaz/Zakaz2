import { Order } from '@/order/entities/order.entity';
import { TGender } from '@/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @CreateDateColumn()
  start_sell_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_sell_date: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column('text', { array: true, default: [] })
  category: string[];

  @Column({
    type: 'text',
    array: true,
  })
  images: string[];

  @Column({ nullable: true, select: false })
  creator_email: string;

  @ManyToMany(() => Order, (order) => order.items)
  orders: Order[];

  @Column({ default: true })
  inStock: boolean;
}
