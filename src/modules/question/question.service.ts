import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity } from '../../entities/question.entity';
import { QuestionDto } from '../test/test.dto';
import { AnswerEntity } from '../../entities/answer.entity';
import { getUuidV1 } from '../../helpers/uuid.helper';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly _repositoryQuestion: Repository<QuestionEntity>,
  ) {}

  async store(dto: QuestionDto): Promise<QuestionEntity> {
    try {
      const question = await this._repositoryQuestion.save({
        ...dto,
        testing: { id: dto.testing.id },
        id: getUuidV1(),
      });

      return await this.findOne(question.id);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async saveRightAnswers(question: QuestionEntity, answers: AnswerEntity[]) {
    return await this._repositoryQuestion
      .createQueryBuilder()
      .relation('rightAnswers')
      .of(question)
      .add(answers);
  }

  async findOne(id: string): Promise<QuestionEntity> {
    return await this._repositoryQuestion.findOne({
      where: { id },
      relations: ['answers', 'rightAnswers'],
    });
  }
}
