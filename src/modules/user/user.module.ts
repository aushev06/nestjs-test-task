import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TestModule } from '../test/test.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TestModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
