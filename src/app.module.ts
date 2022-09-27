import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppValidationPipe } from './app.validation-pipe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './modules/auth/auth.module';
import { Exists } from './validators/exists.validator';
import { Unique } from './validators/unique.validator';
import { AppFilter } from './app.filter';
import { TestModule } from './modules/test/test.module';
import { QuestionModule } from './modules/question/question.module';
import { AnswerModule } from './modules/answer/answer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      namingStrategy: new SnakeNamingStrategy(),
      name: 'default',
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      logging: process.env.NODE_ENV === 'test' ? false : ['error', 'query'],
      migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
      entities: [
        __dirname + '/entities/**/*.entity{.js,.ts}',
        __dirname + '/entities/**/*.view{.js,.ts}',
      ],
      synchronize: true,
      migrationsRun: true,
      keepConnectionAlive: true,
      cache: {
        type: 'ioredis',
        options: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
        },
      },
    }),
    AuthModule,
    TestModule,
    QuestionModule,
    AnswerModule,
  ],
  controllers: [AppController],
  providers: [
    Exists,
    Unique,
    AppService,
    {
      provide: APP_PIPE,
      useClass: AppValidationPipe,
      scope: Scope.REQUEST,
    },
    {
      provide: APP_FILTER,
      useClass: AppFilter,
    },
  ],
})
export class AppModule {}
