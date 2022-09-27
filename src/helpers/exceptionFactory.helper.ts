import { UnprocessableEntityException, ValidationError } from '@nestjs/common';

function getErrors(err: ValidationError[]): Array<unknown> {
  return err.map(error => ({
    field: error?.property,
    messages: error?.constraints ? Object.values(error?.constraints) : undefined,
    children: error.children?.length ? getErrors(error.children) : undefined,
  }));
}

export function exceptionFactory(errors: ValidationError[]): Array<string> {
  const res = getErrors(errors);
  throw new UnprocessableEntityException({
    errors: res,
  });
}
