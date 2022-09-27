import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserInterface } from 'src/common/interfaces/user.interface';

@Injectable()
export class JwtPassAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = UserInterface | null>(
    _1: unknown,
    user: TUser,
    _2: unknown,
    _3: unknown,
    _4?: unknown,
  ): TUser {
    console.log('Pass guard called');
    return {
      ...user,
    };
  }
}
