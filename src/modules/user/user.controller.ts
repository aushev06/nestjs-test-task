import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageableParams } from '../../common/params/pageable.params';
import { User } from '../../common/decorators/user.decorator';
import { Roles, UserEntity } from '../../entities/user.entity';
import { UserInterface } from '../../common/interfaces/user.interface';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { SaveUserDto } from './user.dto';
import { TestService } from '../test/test.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly testService: TestService,
  ) {}

  @Get()
  async findAll(
    @Query() dto: PageableParams,
    @User(Roles.ADMIN) user: UserInterface,
  ) {
    return await this.service.findAll(dto);
  }

  @Post()
  async store(@Body() dto: SaveUserDto): Promise<UserEntity> {
    return await this.service.store(dto);
  }

  @Get(':id/tests')
  async getUserTests(@Param('id') id: string) {
    return await this.testService.getTestsByUserId(id);
  }
}
