import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { AssignUsersToTest, SaveAnswers, SaveTestDto } from './test.dto';
import { User } from '../../common/decorators/user.decorator';
import { Roles } from '../../entities/user.entity';
import { UserInterface } from '../../common/interfaces/user.interface';
import { TestService } from './test.service';
import { FormInterceptor } from '../../common/interceptors/form.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageableParams } from '../../common/params/pageable.params';

@Controller('tests')
@ApiTags('tests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestController {
  constructor(private readonly service: TestService) {}

  @Post()
  @UseInterceptors(
    FormInterceptor(({ req }) => {
      req.body.user = { id: req.user.sub };
    }),
  )
  async store(@Body() dto: SaveTestDto, @User(Roles.ADMIN) _: UserInterface) {
    return await this.service.store(dto);
  }

  @Get()
  async findAll(
    @Query() dto: PageableParams,
    @User(Roles.ADMIN) user: UserInterface,
  ) {
    return await this.service.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post(':id/assign')
  async assignTestToUser(
    @Param('id') testId: string,
    @Body() dto: AssignUsersToTest,
    @User(Roles.ADMIN) _: UserInterface,
  ) {
    await this.service.assignTestToUser(testId, dto);
  }

  @Post(':id/save-answers')
  @UseInterceptors(
    FormInterceptor(({ req }) => {
      req.body.user = { id: req.user.sub };
    }),
  )
  async saveAnswers(@Param('id') id: string, @Body() dto: SaveAnswers) {
    return await this.service.saveAnswers(id, dto);
  }
}
