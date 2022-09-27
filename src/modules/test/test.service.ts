import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestingEntity } from '../../entities/testing.entity';
import { Repository } from 'typeorm';
import { AssignUsersToTest, SaveAnswers, SaveTestDto } from './test.dto';
import { QuestionEntity } from '../../entities/question.entity';
import { AnswerEntity } from '../../entities/answer.entity';
import { QuestionService } from '../question/question.service';
import { async } from 'rxjs';
import { AnswerService } from '../answer/answer.service';
import { getUuidV1 } from '../../helpers/uuid.helper';
import { Page, PageableParams } from '../../common/params/pageable.params';
import { UserInterface } from '../../common/interfaces/user.interface';
import { UserEntity } from '../../entities/user.entity';
import { UserAnswerEntity } from '../../entities/user-answer.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestingEntity)
    private readonly _repository: Repository<TestingEntity>,
    @InjectRepository(UserAnswerEntity)
    private readonly _repositoryUserAnswer: Repository<UserAnswerEntity>,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  async findAll(pageable: PageableParams): Promise<Page<TestingEntity>> {
    const [items, total] = await this._repository.findAndCount({
      relations: ['testUsers'],
    });

    const totalPages = total / pageable.size || 1;

    return {
      totalPages: Math.ceil(totalPages < 1 ? 1 : totalPages),
      content: items,
      pageable: { pageNumber: pageable.page, pageSize: pageable.size },
    };
  }

  async store(dto: SaveTestDto): Promise<TestingEntity> {
    const test = await this._repository.save({
      name: dto.name,
      user: { id: dto.user.id },
      id: getUuidV1(),
    });

    for (const question of dto.questions) {
      const answers = [];
      const savedQuestion = await this.questionService.store({
        ...question,
        testing: { id: test.id } as TestingEntity,
      });

      for (const answer of question.answers) {
        const savedAnswer = await this.answerService.store({
          ...answer,
          question: { id: savedQuestion.id } as QuestionEntity,
        });

        answer.isRight && answers.push(savedAnswer);
      }

      await this.questionService.saveRightAnswers(savedQuestion, answers);
    }
    return test;
  }

  async findOne(id: string): Promise<TestingEntity> {
    return await this._repository.findOne({
      where: { id },
      relations: ['questions', 'questions.answers', 'testUsers'],
    });
  }

  async getTestsByUserId(userId: string): Promise<TestingEntity[]> {
    const qb = this._repository.createQueryBuilder('t');
    qb.leftJoin('t.testUsers', 'users');
    qb.leftJoinAndSelect(
      't.userAnswers',
      'user_answers',
      'user_answers.user_id=:userId',
      { userId },
    );
    qb.where('users.id=:userId', { userId });

    return await qb.getMany();
  }

  async saveAnswers(
    testId: string,
    dto: SaveAnswers,
  ): Promise<UserAnswerEntity> {
    const test = await this.findOne(testId);
    let rightAnswersCount = 0;
    const questionCount = test.questions.length;
    let lastUserAnswer: UserAnswerEntity = null;
    for (const q of dto.questions) {
      const question = await this.questionService.findOne(q.id);
      if (!question.rightAnswers.length && !q.answers.length) {
        lastUserAnswer = await this._repositoryUserAnswer.save({
          isRight: true,
          user: { id: dto.user.id },
          answers: [],
          question: { id: q.id },
          testing: { id: testId },
          progress: 0,
          id: getUuidV1(),
        });
        rightAnswersCount++;
      } else if (
        question.rightAnswers.every((answer) => {
          const userAnswers = q.answers.map((a) => a.id);
          return userAnswers.includes(answer.id);
        }) &&
        question.rightAnswers.length === q.answers.length
      ) {
        lastUserAnswer = await this._repositoryUserAnswer.save({
          isRight: true,
          user: { id: dto.user.id },
          answers: question.rightAnswers,
          question: { id: q.id },
          testing: { id: testId },
          progress: 0,
          id: getUuidV1(),
        });

        rightAnswersCount++;
      } else {
        lastUserAnswer = await this._repositoryUserAnswer.save({
          isRight: false,
          user: { id: dto.user.id },
          answers: question.rightAnswers,
          question: { id: q.id },
          testing: { id: testId },
          progress: 0,
          id: getUuidV1(),
        });
      }
      lastUserAnswer.progress = Math.floor(
        (rightAnswersCount / questionCount) * 100,
      );
      await this._repositoryUserAnswer.save(lastUserAnswer);
    }

    return lastUserAnswer;
  }

  async assignTestToUser(testId: string, dto: AssignUsersToTest) {
    const test = await this.findOne(testId);
    await this._repository
      .createQueryBuilder()
      .relation('testUsers')
      .of(test)
      .add(dto.userIds.map((item) => ({ id: item })));
  }
}
