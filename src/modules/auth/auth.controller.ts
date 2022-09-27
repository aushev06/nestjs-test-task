import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { UserEntity } from 'src/entities/user.entity';
import {
  AuthEmailDto,
  CreateUserDto,
} from 'src/modules/auth/dto/create-auth.dto';

import { AuthService } from './auth.service';
import { User } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from './guards/jwt-guard';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Create user',
    description: 'Will return created user',
  })
  async create(@Body() createAuthDto: CreateUserDto): Promise<unknown> {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User authorization returns jwt token',
    description: 'Returns many data about user and auth bearer token',
  })
  @ApiExtraModels(AuthEmailDto)
  @ApiBody({
    schema: { oneOf: [{ $ref: getSchemaPath(AuthEmailDto) }] },
  })
  public async login(
    @Body() dto: AuthEmailDto,
  ): Promise<{ user: UserEntity; token: string }> {
    const { user, token } = await this.authService.login(dto);

    if (!user) {
      throw new HttpException('Login or password is incorrect', 404);
    }

    return { user, token };
  }

  @Get('me')
  @ApiOperation({
    summary: 'Return authenticating user',
    description: '',
  })
  @UseGuards(JwtAuthGuard)
  async getMe(@User() user: UserInterface): Promise<UserEntity> {
    return await this.authService.getMe(user);
  }
}
