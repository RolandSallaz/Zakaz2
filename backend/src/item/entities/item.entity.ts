import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

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
  gender: 'male' | 'female' | 'unisex';

  @Column()
  type: string;
}
