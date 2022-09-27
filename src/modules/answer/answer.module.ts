import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from '../../entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerEntity])],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
