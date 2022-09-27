import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Roles } from '../../entities/user.entity';

export const User = createParamDecorator(
  (data: Roles | Roles[], ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Express.Request;
    if (!req.user) {
      throw new UnauthorizedException('User not authentificated');
    }
    if (data !== undefined) {
      if (!Array.isArray(data)) {
        data = [data];
      }
      if (data.length && !data.includes(req.user?.role)) {
        throw new ForbiddenException(
          'You have no permission to do this action',
        );
      }
    }

    return req.user;
  },
);
