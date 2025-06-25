import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    /**
     * @description Lista todos os usuários, com opções de filtro e ordenação.
     * @param filter.role - Filtra usuários por 'user' ou 'admin'.
     * @param filter.name - Filtra usuários por nome (busca parcial, case-insensitive).
     * @param filter.sortBy - Campo para ordenação (ex: 'id', 'name', 'createdAt').
     * @param filter.order - Ordem 'asc' ou 'desc'.
     * @returns Promise<User[]> - Uma lista de usuários.
     */
    // CORRIGIDO: Adicionado 'name' ao tipo do filtro
    async findAll(filter?: { role?: 'user' | 'admin'; name?: string; sortBy?: string; order?: 'asc' | 'desc' }): Promise<User[]> {
        const queryBuilder = this.usersRepository.createQueryBuilder('user');

        if (filter?.role) {
            queryBuilder.andWhere('user.role = :role', { role: filter.role });
        }

        // NOVO: Lógica para filtrar por nome (busca parcial e case-insensitive)
        if (filter?.name) {
            queryBuilder.andWhere('LOWER(user.name) LIKE LOWER(:name)', { name: `%${filter.name}%` });
        }

        // CORRIGIDO: Adicionado 'id' às colunas de ordenação válidas e definido padrão para 'id' e 'asc'
        const validSortColumns = ['id', 'name', 'email', 'createdAt', 'lastLogin'];
        const sortByColumn = filter?.sortBy || 'id'; // Padrão: 'id'
        const orderType = (filter?.order || 'asc').toUpperCase() as 'ASC' | 'DESC'; // Padrão: 'asc' para ID

        // Garante que 'sortBy' é um campo válido para evitar SQL Injection básico
        if (!validSortColumns.includes(sortByColumn)) {
            throw new BadRequestException(`Campo de ordenação inválido: ${sortByColumn}`);
        }

        queryBuilder.orderBy(`user.${sortByColumn}`, orderType);

        return queryBuilder.getMany();
    }

    /**
     * @description Encontra um usuário pelo seu endereço de e-mail.
     * @param email - O e-mail do usuário.
     * @returns Promise<User | null> - O usuário encontrado ou null se não existir.
     */
    async findOneByEmail(email: string): Promise<User | null> {
        try {
            return await this.usersRepository.findOne({ where: { email } });
        } catch (error) {
            // Em vez de 'Usuario não foi encontrado', lance uma NotFoundException para o NestJS
            throw new NotFoundException(`Usuário com e-mail ${email} não encontrado.`);
        }
    }

    /**
     * @description Encontra um usuário pelo seu ID.
     * @param id - O ID do usuário (numérico no BD, mas pode vir como string do controller).
     * @returns Promise<User | null> - O usuário encontrado ou null se não existir.
     */
    async findOneById(id: number | string): Promise<User | null> {
        const userId = typeof id === 'string' ? parseInt(id, 10) : id;

        if (isNaN(userId)) {
            throw new BadRequestException('ID de usuário inválido.');
        }
        return await this.usersRepository.findOne({ where: { id: userId } });
    }

    /**
     * @description Cria um novo usuário.
     * @param createUserDto - DTO com os dados do novo usuário.
     * @returns Promise<User> - O usuário criado e salvo.
     */
    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.usersRepository.create(createUserDto);
        // Observação: O hash da senha deve ser feito antes de chamar este método,
        // geralmente no Auth service ou em um hook/subscriber do TypeORM.
        return this.usersRepository.save(newUser);
    }

    /**
     * @description Atualiza as informações de um usuário pelo seu ID.
     * @param id - O ID do usuário a ser atualizado.
     * @param updateUserDto - DTO com os dados a serem atualizados.
     * @returns Promise<User> - O usuário atualizado.
     * @throws NotFoundException se o usuário não for encontrado.
     */
    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const userId = parseInt(id, 10); // Converte string ID para number

        if (isNaN(userId)) {
            throw new BadRequestException('ID de usuário inválido.');
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }

        // Atualiza as propriedades do usuário com os dados do DTO
        Object.assign(user, updateUserDto);

        // Se a senha for atualizada, ela deve ser hashada ANTES de ser salva
        if (updateUserDto.password) {
            // Lógica de hash da senha aqui ou antes de chamar updateUser
            // Ex: user.password = await bcrypt.hash(updateUserDto.password, 10);
            throw new BadRequestException('A atualização da senha deve ser feita através de um endpoint específico ou hashada antes de chamar este serviço.');
        }

        return this.usersRepository.save(user);
    }

    /**
     * @description Remove um usuário pelo seu ID.
     * @param id - O ID do usuário a ser removido.
     * @returns Promise<void>
     * @throws NotFoundException se o usuário não for encontrado.
     */
    async remove(id: string): Promise<void> {
        const userId = parseInt(id, 10);

        if (isNaN(userId)) {
            throw new BadRequestException('ID de usuário inválido.');
        }

        const result = await this.usersRepository.delete(userId); // Use delete diretamente com o ID
        if (result.affected === 0) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
    }

    /**
     * @description Atualiza a data do último login de um usuário.
     * @param userId - O ID numérico do usuário.
     * @returns Promise<void>
     */
    async updateLastLogin(userId: number): Promise<void> {
        // Find the user first to ensure they exist before updating
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`Usuário com ID ${userId} não encontrado para atualizar lastLogin.`);
        }
        await this.usersRepository.update(userId, {
            lastLogin: new Date()
        });
    }

    /**
     * @description Lista usuários que não fizeram login nos últimos 'days' dias.
     * @param days - Número de dias para considerar inativo (padrão: 30).
     * @returns Promise<User[]> - Uma lista de usuários inativos.
     */
    async findInactiveUsers(days: number = 30): Promise<User[]> {
        const date = new Date();
        date.setDate(date.getDate() - days);

        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.lastLogin < :date OR user.lastLogin IS NULL', { date })
            .getMany();
    }
}