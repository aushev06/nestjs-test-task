import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { SaveUserDto } from 'src/modules/user/user.dto';
import { Repository } from 'typeorm';
import { getUuidV1 } from '../../helpers/uuid.helper';
import * as bcrypt from 'bcrypt';
import { Page, PageableParams } from '../../common/params/pageable.params';
import { TestingEntity } from '../../entities/testing.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repository: Repository<UserEntity>,
  ) {}

  async store(dto: SaveUserDto): Promise<UserEntity> {
    try {
      console.log(dto);
      const savedUser = await this._repository.save({
        ...dto,
        id: getUuidV1(),
        passwordHash: await this.hashPassword(dto.password),
      });

      return await this.findOne(savedUser.id);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async findAll(pageable: PageableParams): Promise<Page<UserEntity>> {
    const [items, total] = await this._repository.findAndCount();

    const totalPages = total / pageable.size || 1;

    return {
      totalPages: Math.ceil(totalPages < 1 ? 1 : totalPages),
      content: items,
      pageable: { pageNumber: pageable.page, pageSize: pageable.size },
    };
  }

  async findOne(id: string): Promise<UserEntity> {
    return await this._repository
      .createQueryBuilder('u')
      .where('u.id=:id', { id })
      .getOne();
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this._repository
      .createQueryBuilder('u')
      .where('u.email=:email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException();
    }

    return await this.findOne(user.id);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}
