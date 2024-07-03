import { TGender } from '@/types';
import { User } from '@/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @Column({ default: 'unisex' })
  gender: TGender;

  @Column()
  type: string;

  @Column({
    type: 'text',
    array: true,
  })
  images: string[];

  @Column({ nullable: true, select: false })
  creator_email: string;
}
