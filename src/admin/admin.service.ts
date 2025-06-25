import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

interface UserFilterOptions {
  role?: 'user' | 'admin';
  name?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

@Injectable()
export class AdminService {
  constructor(private usersService: UsersService) {}

  async findAllUsers(filterOptions?: UserFilterOptions): Promise<User[]> {
    return this.usersService.findAll(filterOptions);
  }

  async updateUserRole(id: string, role: 'user' | 'admin'): Promise<User> {
    return this.usersService.updateUser(id, { role });
  }

  async deleteUser(id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}