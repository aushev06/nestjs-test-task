import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestingEntity } from '../../entities/testing.entity';
import { QuestionModule } from '../question/question.module';
import { AnswerModule } from '../answer/answer.module';
import { UserAnswerEntity } from '../../entities/user-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestingEntity, UserAnswerEntity]),
    QuestionModule,
    AnswerModule,
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
