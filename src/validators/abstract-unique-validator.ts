import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  EntityManager,
  EntitySchema,
  FindOptionsWhere,
  Not,
  ObjectType,
} from 'typeorm';

interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    (
      | ((validationArguments: ValidationArguments) => FindOptionsWhere<E>)
      | keyof E
    ),
  ];
}

export abstract class UniqueValidator implements ValidatorConstraintInterface {
  protected constructor(protected readonly manager: EntityManager) {}

  public async validate<E>(
    value: string,
    args: UniqueValidationArguments<E>,
  ): Promise<boolean> {
    const [EntityClass, findCondition = args.property] = args.constraints;
    let findConditionArgs = null;
    if (typeof findCondition === 'function') {
      findConditionArgs = findCondition(args);
      if (findConditionArgs.id) {
        findConditionArgs.id = Not(findConditionArgs.id);
      }

      if (!findConditionArgs.id) {
        delete findConditionArgs.id;
      }
    }

    try {
      return (
        (await this.manager.getRepository(EntityClass).count({
          where: findConditionArgs,
        })) <= 0
      );
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public defaultMessage(args: ValidationArguments): string {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `${entity} with the same '${args.property}' already exist`;
  }
}
