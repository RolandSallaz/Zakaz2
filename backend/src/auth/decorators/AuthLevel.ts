import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../enums';

export const AuthLevel = (level: ROLES) => SetMetadata('authLevel', level);
