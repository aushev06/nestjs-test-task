import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidateIf,
} from 'class-validator';
import { SaveUserDto } from 'src/modules/user/user.dto';
import { Exists } from 'src/validators/exists.validator';
import { Match } from 'src/validators/match.validator';
import { IsNull, Not } from 'typeorm';

export class CreateUserDto extends SaveUserDto {}

export class AuthEmailDto {
  @ApiProperty({ example: 'test@test.ru', required: false })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'Qwerty123' })
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  remember?: boolean;
}

export class AuthJwtPayload {
  sub: string;
  role: string;
  email: string;
}
