import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'email@email.com' },
        password: { type: 'string', example: '123456' },
      },
    },
  })
  async login(@Body() body: { email: string; password: string }) {
    return await this.authService.login(body.email, body.password);
  }

  @Post('register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Herbert Matheus' },
        email: { type: 'string', example: 'email@email.com' },
        password: { type: 'string', example: '123456' },
      },
    },
  })
  async register(@Body() body: { name: string; email: string; password: string }) {
    return await this.authService.register(body.name, body.email, body.password);
  }
}
