import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @Column()
  email: string;

  @Column({ default: 0 })
  authCode: number;
}
