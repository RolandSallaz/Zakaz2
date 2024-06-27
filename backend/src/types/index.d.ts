import { User } from 'src/users/entities/user.entity';

export interface IAuthData {
  user: User;
  token: string;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type TActiveTime = '15d' | '30d' | '90d';

export type TGender = 'male' | 'female' | 'unisex';
