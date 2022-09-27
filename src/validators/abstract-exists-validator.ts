import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  Connection,
  EntitySchema,
  FindOptionsWhere,
  Not,
  ObjectType,
} from 'typeorm';

export interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    (
      | ((validationArguments: ValidationArguments) => FindOptionsWhere<E>)
      | keyof E
    ),
  ];
}

export abstract class ExistsValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly connection: Connection) {}

  public async validate<E>(
    value: string,
    args: UniqueValidationArguments<E>,
  ): Promise<boolean> {
    const [EntityClass, findCondition = args.property] = args.constraints;

    let findConditionArgs = null;
    if (typeof findCondition === 'function') {
      findConditionArgs = findCondition(args);

      if (!findConditionArgs.id) {
        delete findConditionArgs.id;
      }
    }

    try {
      return (
        (await this.connection.getRepository(EntityClass).count({
          where: findConditionArgs,
        })) > 0
      );
    } catch (e) {
      return false;
    }
  }

  public defaultMessage(args: ValidationArguments): string {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `${entity} with the same '${args.property}' doesn't exist`;
  }
}
