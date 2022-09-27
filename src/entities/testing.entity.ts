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
import { QuestionEntity } from './question.entity';
import { UserAnswerEntity } from './user-answer.entity';
import { AnswerEntity } from './answer.entity';

@Entity('testing')
export class TestingEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    primary: true,
  })
  id: string;

  @Column()
  name: string;

  @OneToMany(() => QuestionEntity, (e) => e.testing)
  questions: QuestionEntity[];

  @OneToMany(() => UserAnswerEntity, (e) => e.testing)
  userAnswers: UserAnswerEntity[];

  @ManyToOne(() => UserEntity, (e) => e.tests)
  user: UserEntity;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'test_users' })
  testUsers: UserEntity[];

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
