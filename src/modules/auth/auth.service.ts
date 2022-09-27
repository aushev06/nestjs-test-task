import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { UserEntity } from 'src/entities/user.entity';
import {
  AuthEmailDto,
  CreateUserDto,
} from 'src/modules/auth/dto/create-auth.dto';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createAuthDto: CreateUserDto): Promise<unknown> {
    return await this.userService.store(createAuthDto);
  }

  async login(dto: AuthEmailDto): Promise<{ user: UserEntity; token: string }> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException();
    }

    if (await this.comparePasswords(dto.password, user.passwordHash)) {
      const token = await this.generateJWT(user);

      return {
        user,
        token,
      };
    }

    throw new NotFoundException();
  }

  async getMe(user: UserInterface): Promise<UserEntity> {
    return await this.userService.findOne(user.sub);
  }

  generateJWT(user: UserEntity, expire = '5d'): Promise<string> {
    return this.jwtService.signAsync(
      { sub: user.id, role: user.role, email: user.email },
      {
        expiresIn: expire,
      },
    );
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  comparePasswords(password: string, passwortHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwortHash);
  }
}
