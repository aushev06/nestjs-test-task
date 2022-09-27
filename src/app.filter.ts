import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { isString } from 'class-validator';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch()
export class AppFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    // Пока тестовый код
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();
    let status: number;
    let err;
    console.log('Exception happened ------------------------>', exception);
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      err = exception.getResponse() as {
        error: string;
        message: string;
        response: string;
        errors: unknown;
      };
      if (isString(err)) {
        err = {
          message: err,
        };
      }
    } else if (exception instanceof EntityNotFoundError) {
      status = 404;
      err = {
        error: exception.name,
        message: 'Record not found',
        errors:
          process.env.NODE_ENV === 'production' ? undefined : exception.stack,
      };
    } else if (exception instanceof Error) {
      status = 500;
      err = {
        error: exception.name,
        message: 'Server error',
        errors:
          process.env.NODE_ENV === 'production' ? undefined : exception.stack,
      };
    }

    response.status(status).json({
      statusCode: status,
      message: err?.message || err?.response || 'Internal server error',
      errors: err?.errors,
      error: err?.error || 'Server gone',
      data: null,
    });
  }
}
