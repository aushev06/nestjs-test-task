import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectEntityManager } from '@nestjs/typeorm';
import { ValidatorConstraint } from 'class-validator';
import { Connection, EntityManager } from 'typeorm';

import { UniqueValidator } from './abstract-unique-validator';

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class Unique extends UniqueValidator {
  constructor(
    @InjectEntityManager() protected readonly manager: EntityManager,
  ) {
    super(manager);
  }
}
