import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Roles, UserEntity } from 'src/entities/user.entity';
import { Match } from 'src/validators/match.validator';
import { Unique } from 'src/validators/unique.validator';
import * as uuid from 'uuid';

export class UserDto {
  @ApiProperty({ description: 'User uuid', default: uuid.v1() })
  id: string;
  @ApiProperty({ description: 'Admin user uuid', default: uuid.v1() })
  companyId: string;
  @ApiProperty({ description: 'User name' })
  username: string;
  @ApiProperty({ description: 'User email' })
  email: string;
  @ApiProperty({ description: 'User enabled status' })
  enabled: boolean;
  @ApiProperty({ description: 'User email verified date' })
  emailVerified: string;
  @ApiProperty({ description: 'User firstname' })
  firstName: string;
  @ApiProperty({ description: 'User lastname' })
  lastName: string;
  @ApiProperty({ description: 'User avatar' })
  avatar: string;
  @ApiProperty({
    description: 'User created at timestamp',
    default: new Date().getTime(),
  })
  createdAt: number;
  @ApiProperty({
    description: 'User updated at timestamp',
    default: new Date().getTime(),
  })
  updatedAt: number;
  @ApiProperty({ description: 'User deleted at timestamp' })
  deletedAt: Date;
}

export class SaveUserDto {
  @ApiProperty({ description: 'User email', required: false })
  @IsEmail()
  @IsOptional()
  @Validate(
    Unique,
    [
      UserEntity,
      ({ object: dto }): { email?: string; id?: string } => ({
        email: dto?.email,
        id: dto?.id,
      }),
    ],
    {
      message: (args) => `User with this email already exists`,
    },
  )
  email?: string;

  @ApiProperty({ description: 'User selfie' })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({
    default: 'Qwerty123',
    description: '/^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @ApiProperty({ default: 'Qwerty123' })
  @Match('password', { message: 'Confirm password does not match ' })
  @ValidateIf((dto) => dto.password?.length && dto.oldPassword?.length)
  confirmPassword?: string;

  @ApiProperty({ description: 'Any string' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]*$/, {
    message: 'First Name format is not correct ',
  })
  firstName: string;

  @ApiProperty({ description: 'Any string' })
  @MinLength(2)
  @MaxLength(255)
  @IsString()
  @Matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]*$/, {
    message: 'Last Name format is not correct ',
  })
  lastName: string;

  @ApiProperty({ description: 'Any string' })
  @MinLength(2)
  @MaxLength(255)
  @IsString()
  @IsOptional()
  @Matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/, {
    message: 'Last Name format is not correct ',
  })
  secondName: string;
}
