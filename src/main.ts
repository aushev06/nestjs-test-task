import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer as classValidatorContainer } from 'class-validator';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: true });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const options = new DocumentBuilder()
    .setTitle(
      'Testing API' + (process.env.NODE_ENV !== 'production' ? ' Sandbox' : ''),
    )
    .setDescription('The testign API description ')
    .setVersion('[[BUILD_VERSION]]')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'Test API Swagger',
  });

  classValidatorContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3333);
}
bootstrap();
