import {
  BaseEntity as BS,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import { getUuidV1 } from '../helpers/uuid.helper';
import { UserEntity } from './user.entity';
import { QuestionEntity } from './question.entity';
import { TestingEntity } from './testing.entity';
import { AnswerEntity } from './answer.entity';

@Entity('user_answers')
export class UserAnswerEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    primary: true,
  })
  id: string;

  @ManyToOne(() => QuestionEntity, (e) => e.userAnswers)
  question: QuestionEntity;

  @ManyToOne(() => TestingEntity, (e) => e.userAnswers)
  testing: TestingEntity;

  @Column({ type: 'jsonb' })
  answers: AnswerEntity[];

  @Column({ default: 0 })
  progress: number;

  @Column()
  isRight: boolean;

  @ManyToOne(() => UserEntity, (e) => e.userAnswers, { onDelete: 'SET NULL' })
  user: UserEntity;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
