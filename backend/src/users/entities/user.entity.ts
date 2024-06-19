import { ROLES } from '@/auth/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: ROLES.USER })
  auth_level: ROLES;

  @Column()
  email: string;

  @Column({ default: 0 })
  authCode: number;
}
