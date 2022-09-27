import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../entities/user.entity';
import { TestingEntity } from '../../entities/testing.entity';
import { QuestionEntity } from '../../entities/question.entity';
import { getUuidV1 } from '../../helpers/uuid.helper';

export class AnswerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  isRight: boolean;

  question?: QuestionEntity;
}

export class QuestionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;

  @ApiProperty({ isArray: true, type: AnswerDto })
  answers: AnswerDto[];

  testing?: TestingEntity;
}

export class SaveTestDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ isArray: true, type: QuestionDto })
  questions: QuestionDto[];

  user: UserEntity;
}

export class AssignUsersToTest {
  @ApiProperty({ isArray: true, example: [getUuidV1()] })
  userIds: string[];
}

export class SaveAnswers {
  @ApiProperty({ isArray: true, type: QuestionDto })
  questions: QuestionDto[];

  user: UserEntity;
}
