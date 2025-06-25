import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ){}

    async login(email:string,password:string): Promise<{ token: string; user: { id: string; name: string; email: string; role: 'user' | 'admin' } }> {
        const user = await this.userService.findOneByEmail(email);

        if(!user){
            throw new UnauthorizedException('E-mail ou senha inválidos.');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Senha incorreta');
        }

        await this.userService.updateLastLogin(user.id); 

        const payLoad = { email: user.email, sub: user.id.toString(), role: user.role as 'user' | 'admin' };
        const accessToken = this.jwtService.sign(payLoad);

        return {
            token: accessToken,
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                role: user.role as 'user' | 'admin',
            }
        };
    }

    async register(name: string, email: string, password: string): Promise<{ token: string; user: { id: string; name: string; email: string; role: 'user' | 'admin' } } | null> {
        const userExists = await this.userService.findOneByEmail(email);

        if (userExists) {
            return null;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User();
        newUser.name = name;
        newUser.email = email;
        newUser.password = hashedPassword;
        newUser.role = "user";
        newUser.lastLogin = null; 

        const savedUser = await this.userService.create(newUser);

        if (!savedUser || savedUser.id === undefined || savedUser.id === null) {
            throw new Error('Falha ao criar o usuário ou ID do usuário não retornado.');
        }

        const payLoad = { email: savedUser.email, sub: savedUser.id.toString(), role: savedUser.role as 'user' | 'admin' };
        const accessToken = this.jwtService.sign(payLoad);

        return {
            token: accessToken,
            user: {
                id: savedUser.id.toString(),
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role as 'user' | 'admin',
            }
        };
    }
}