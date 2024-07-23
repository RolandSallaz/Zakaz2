import { TInfoType } from '@/types';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Info {
  @PrimaryColumn()
  key: TInfoType;

  @Column()
  value: string;
}
