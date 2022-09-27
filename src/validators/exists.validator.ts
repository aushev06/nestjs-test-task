import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ValidatorConstraint } from 'class-validator';
import { ExistsValidator } from 'src/validators/abstract-exists-validator';
import { Connection } from 'typeorm';

@ValidatorConstraint({ name: 'exists', async: true })
@Injectable()
export class Exists extends ExistsValidator {
  constructor(@InjectConnection() protected readonly connection: Connection) {
    super(connection);
  }
}
