import { ROLES } from '@/auth/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  register_date: Date;

  @Column({ default: ROLES.USER })
  auth_level: ROLES;

  @Column({ unique: true })
  email: string;

  @Column({ default: 0 })
  authCode: number;
}
