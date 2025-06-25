import { Controller, Get, UseGuards, Patch, Param, Body, Delete, NotFoundException, BadRequestException, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

import { JwtGuard } from '../jwt/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../auth/roles.decorator';

import { User } from '../users/user.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';

import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  /**
   * @description Lista todos os usuários. Apenas para administradores.
   * GET /admin/users
   * Com suporte a filtros e ordenação via query parameters.
   */
  @Get('users')
  @ApiQuery({ name: 'role', required: false, enum: ['admin', 'user'], description: 'Filtrar usuários por role' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filtrar usuários por nome (busca parcial)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['id', 'name', 'createdAt', 'email', 'lastLogin'], description: 'Campo para ordenação' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Ordem ascendente ou descendente' })
  @ApiResponse({ status: 200, description: 'Lista de todos os usuários.', type: [User] })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido (não é admin).' })
  async listAllUsers(
    @Query('role') role?: 'user' | 'admin',
    @Query('name') name?: string,
    @Query('sortBy') sortBy = 'id',
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ): Promise<User[]> {
    return this.adminService.findAllUsers({ role, name, sortBy, order });
  }

  /**
   * @description Atualiza a role de um usuário específico. Apenas para administradores.
   * PATCH /admin/users/:id/role
   */
  @Patch('users/:id/role')
  @ApiParam({ name: 'id', description: 'ID do usuário a ser atualizado.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['user', 'admin'], description: 'Nova role para o usuário.' },
      },
      required: ['role'],
    },
  })
  @ApiResponse({ status: 200, description: 'Role do usuário atualizada com sucesso.', type: User })
  @ApiResponse({ status: 400, description: 'Role inválida.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido (não é admin).' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async updateUserRole(
    @Param('id') userId: string,
    @Body('role') newRole: UserRole,
  ): Promise<User> {
    if (!['user', 'admin'].includes(newRole)) {
      throw new BadRequestException('Role inválida. A role deve ser "user" ou "admin".');
    }
    return this.adminService.updateUserRole(userId, newRole);
  }

  /**
   * @description Deleta um usuário específico. Apenas para administradores.
   * DELETE /admin/users/:id
   */
  @Delete('users/:id')
  @ApiParam({ name: 'id', description: 'ID do usuário a ser deletado.' })
  @ApiResponse({ status: 204, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido (não é admin).' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.adminService.deleteUser(userId);
  }
}