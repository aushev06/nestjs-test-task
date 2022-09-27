import { BadRequestException, Injectable } from '@nestjs/common';
import { AnswerDto } from '../test/test.dto';
import { AnswerEntity } from '../../entities/answer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getUuidV1 } from '../../helpers/uuid.helper';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly _repository: Repository<AnswerEntity>,
  ) {}

  async store(dto: AnswerDto): Promise<AnswerEntity> {
    try {
      const answer = await this._repository.save({
        ...dto,
        question: { id: dto.question.id },
        id: getUuidV1(),
      });

      return await this.findOne(answer.id);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: string): Promise<AnswerEntity> {
    return await this._repository.findOne({ where: { id } });
  }
}
