import { TGender } from '@/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  start_sell_date: Date;

  @Column({
    type: 'timestamp',
    default: () => `CURRENT_TIMESTAMP + INTERVAL '30 days'`,
  })
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

  @Column()
  main_image: string;
}
