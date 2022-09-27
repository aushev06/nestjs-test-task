import { Role } from 'src/common/decorators/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UserInterface } from '../src/common/interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      user: UserInterface;
    }

    interface Response {
      cookie(key: string, value: string, options?: unknown): void;
      send(data?: unknown);
      status(code: number);
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
