import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { EntityManager } from 'typeorm';

export interface FormInterceptorInterface {
  req: Request;
  res: Response;
  manager: EntityManager;
}

export function FormInterceptor(
  fn: (data: FormInterceptorInterface) => void | Promise<void>,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    constructor(
      @InjectEntityManager()
      private readonly manager: EntityManager,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<unknown>> {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      await fn({ req, res, manager: this.manager });
      return next.handle();
    }
  }

  return mixin(Interceptor);
}
