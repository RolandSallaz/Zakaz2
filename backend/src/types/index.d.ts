import { User } from 'src/users/entities/user.entity';

export interface IAuthData {
  user: User;
  token: string;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type TActiveTime = '90d' | '180d' | 'Infinity';

export type TGender = 'male' | 'female' | 'unisex';

// export type TOrderState = 'confirmed' | 'canceled' | 'inProgress';

export type TInfoType =
  | 'heading_info'
  | 'order'
  | 'customer-help'
  | 'delivery-and-refund'
  | 'contacts'
  | 'privacy-policy';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
