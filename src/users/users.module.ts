import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importe TypeOrmModule
import { User } from './user.entity'; // Importe a sua entidade User

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], 
})
export class UsersModule {}
