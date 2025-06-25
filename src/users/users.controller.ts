import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';

// --- IMPORTS CRUCIAIS PARA OS GUARDS E DECORATORS ---
// Certifique-se que o caminho para seu JwtGuard está correto.
// Se você usa o JwtAuthGuard do NestJS Passport, o import seria:
// import { JwtAuthGuard } from '@nestjs/passport';
import { JwtGuard } from '../jwt/jwt.guard'; // <<< Verifique este caminho e nome

import { RolesGuard } from '../auth/roles.guard'; // <<< Importe seu RolesGuard
import { Roles } from '../auth/roles.decorator'; // <<< Importe seu decorator @Roles
// --- FIM DOS IMPORTS CRUCIAIS ---

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// --- IMPORTS DO SWAGGER ---
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { User } from './user.entity'; // <<< Importe sua entidade User para tipagem de resposta
// --- FIM DOS IMPORTS DO SWAGGER ---

@ApiTags('Users') // Agrupa as rotas sob 'Users' no Swagger UI
@ApiBearerAuth() // Indica que todas as rotas neste controller requerem um token JWT
@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService){}

    /**
     * @description Lista todos os usuários. Apenas para administradores. Permite filtros e ordenação.
     * GET /users?role=admin&sortBy=createdAt&order=asc
     */
    @Get()
    @UseGuards(JwtGuard, RolesGuard) // Protege com autenticação JWT e verificação de roles
    @Roles('admin') // Permite acesso apenas a usuários com a role 'admin'
    @ApiQuery({ name: 'role', required: false, enum: ['admin', 'user'], description: 'Filtrar usuários por role' })
    // CORRIGIDO: Adicionado 'email' e 'lastLogin' às opções de sortBy para corresponder ao UsersService
    @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'createdAt', 'email', 'lastLogin'], description: 'Campo para ordenação' })
    @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Ordem ascendente ou descendente' })
    @ApiResponse({ status: 200, description: 'Lista de todos os usuários.', type: [User] })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 403, description: 'Proibido (não é admin).' })
    async findAll(
        // CORRIGIDO: Tipagem do 'role' para 'user' | 'admin'
        @Query('role') role?: 'user' | 'admin',
        @Query('sortBy') sortBy = 'createdAt',
        @Query('order') order: 'asc' | 'desc' = 'desc'
    ) {
        // A verificação `if (req.user.role !== 'admin')` é removida aqui
        // porque o `@Roles('admin')` e o `RolesGuard` já lidam com isso.
        // Se um não-admin tentar acessar, o guard lançará a exceção `ForbiddenException`.
        return this.usersService.findAll({ role, sortBy, order });
    }

    /**
     * @description Retorna o perfil do usuário logado.
     * GET /users/me
     */
    @Get('me')
    @UseGuards(JwtGuard) // Apenas o guard de autenticação é necessário
    @ApiResponse({ status: 200, description: 'Dados do perfil do usuário logado.', type: User })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    async getProfile(@Request() req) {
        // CORRIGIDO: Usando findOneById com o ID do usuário (req.user.sub) do token JWT
        // 'sub' é a propriedade padrão do JWT para o ID do sujeito/usuário
        return this.usersService.findOneById(req.user.sub);
    }

    /**
     * @description Cria um novo usuário. Apenas para administradores.
     * POST /users
     */
    @Post()
    @UseGuards(JwtGuard, RolesGuard) // Protege com autenticação JWT e verificação de roles
    @Roles('admin') // Permite acesso apenas a usuários com a role 'admin'
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.', type: User })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 403, description: 'Proibido (não é admin).' })
    async create(@Body() createUserDto: CreateUserDto) {
        // A verificação de permissão é feita pelo guard.
        return this.usersService.create(createUserDto);
    }

    /**
     * @description Lista usuários inativos. Apenas para administradores.
     * GET /users/inactive?days=60
     */
    @Get('inactive')
    @UseGuards(JwtGuard, RolesGuard) // Protege com autenticação JWT e verificação de roles
    @Roles('admin') // Permite acesso apenas a usuários com a role 'admin'
    @ApiQuery({ name: 'days', required: false, type: Number, description: 'Número de dias para considerar inativo (padrão: 30)' })
    @ApiResponse({ status: 200, description: 'Lista de usuários inativos.', type: [User] })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 403, description: 'Proibido (não é admin).' })
    async findInactive(
        // CORRIGIDO: Tipagem do 'days' para number diretamente, com valor padrão
        @Query('days') days: number = 30
    ) {
        // A verificação de permissão é feita pelo guard.
        return this.usersService.findInactiveUsers(days);
    }

    /**
     * @description Atualiza o perfil do usuário logado.
     * PUT /users/me
     */
    @Put('me')
    @UseGuards(JwtGuard) // Apenas o guard de autenticação é necessário
    @ApiResponse({ status: 200, description: 'Perfil do usuário atualizado.', type: User })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        // CORRIGIDO: Chamando usersService.updateUser (o método renomeado)
        // com o ID do usuário (req.user.sub) que vem do token JWT.
        return this.usersService.updateUser(req.user.sub, updateUserDto);
    }

    /**
     * @description Remove um usuário pelo ID. Apenas para administradores.
     * DELETE /users/:id
     */
    @Delete(':id')
    @UseGuards(JwtGuard, RolesGuard) // Protege com autenticação JWT e verificação de roles
    @Roles('admin') // Permite acesso apenas a usuários com a role 'admin'
    @ApiResponse({ status: 204, description: 'Usuário deletado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 403, description: 'Proibido (não é admin).' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    async remove(
        @Param('id') id: string // O ID do usuário a ser removido (vem da URL)
        // CORRIGIDO: req não é mais necessário aqui, pois o guard já lidou com a permissão
    ) {
        // A verificação de permissão é feita pelo guard.
        return this.usersService.remove(id);
    }
}