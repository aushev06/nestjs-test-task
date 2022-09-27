import {
  BaseEntity as BS,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import { getUuidV1 } from '../helpers/uuid.helper';
import { UserEntity } from './user.entity';
import { AnswerEntity } from './answer.entity';
import { TestingEntity } from './testing.entity';
import { UserAnswerEntity } from './user-answer.entity';

@Entity('questions')
export class QuestionEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    primary: true,
  })
  id: string;

  @Column()
  text: string;

  @OneToMany(() => AnswerEntity, (e) => e.question)
  answers: AnswerEntity[];

  @OneToMany(() => UserAnswerEntity, (e) => e.question)
  userAnswers: UserAnswerEntity[];

  @ManyToOne(() => TestingEntity, (e) => e.questions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  testing: TestingEntity;

  @ManyToMany(() => AnswerEntity)
  @JoinTable({ name: 'question_right_answers' })
  rightAnswers: AnswerEntity[];

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
