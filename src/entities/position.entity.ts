import {
  BaseEntity as BS,
  Column,
  CreateDateColumn,
  DeleteDateColumn, Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base-entity';
import { getUuidV1 } from '../helpers/uuid.helper';
import { UserEntity } from './user.entity';

@Entity('positions')
export class PositionEntity extends BaseEntity {
  @Column({
    type: 'uuid',
    primary: true,
    default: getUuidV1(),
  })
  id: string;

  @Column()
  name: string;

  @OneToMany(() => UserEntity, (e) => e.position)
  users: UserEntity[];

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
