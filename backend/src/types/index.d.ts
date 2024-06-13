import { User } from 'src/users/entities/user.entity';

export interface IAuthData {
  user: User;
  token: string;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}
