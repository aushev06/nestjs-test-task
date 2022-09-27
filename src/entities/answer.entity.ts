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

@Entity('answers')
export class AnswerEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    primary: true,
  })
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => QuestionEntity, (e) => e.answers)
  question: QuestionEntity;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
