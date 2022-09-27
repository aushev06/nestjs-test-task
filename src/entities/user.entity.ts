import { BaseEntity } from 'src/entities/base-entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { PositionEntity } from './position.entity';
import {UserAnswerEntity} from "./user-answer.entity";
import {TestingEntity} from "./testing.entity";

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    primary: true,
  })
  id: string;

  @Column({ default: Roles.USER })
  role: Roles;

  @Column({ unique: false })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  firstName!: string;

  @Column({ nullable: true })
  lastName!: string;

  get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }
  @ManyToOne(() => PositionEntity, (e) => e.users)
  position: PositionEntity;

  @OneToMany(() => UserAnswerEntity, (e) => e.user)
  userAnswers: UserAnswerEntity[];

  @OneToMany(() => TestingEntity, (e) => e.user)
  tests: TestingEntity[];

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
