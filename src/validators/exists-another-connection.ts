import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ValidatorConstraint } from 'class-validator';
import { Connection } from 'typeorm';

import { ExistsValidator } from './abstract-exists-validator';

@ValidatorConstraint({ name: 'exists', async: true })
@Injectable()
export class ExistsAnotherConnection extends ExistsValidator {
  constructor(
    @InjectConnection('another-connection')
    protected readonly connection: Connection,
  ) {
    super(connection);
  }
}
