
import { SetMetadata } from '@nestjs/common';


export type UserRole = 'user' | 'admin';


export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);