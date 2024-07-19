import { Item } from '@/item/entities/item.entity';
import { TOrderState } from '@/types';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegram: string;

  @Column()
  phone: string;

  @Column({ default: 'unregistered' })
  customer_email: string;

  @CreateDateColumn()
  create_date: Date;

  @Column({ default: 'inProgress' })
  state: TOrderState;

  @ManyToMany(() => Item, (item) => item.orders, { cascade: true })
  @JoinTable() // Это указывает, что Order владеет отношением
  items: Item[];
}
