import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { VersioningType } from '@nestjs/common';
import { configureSwagger } from './configure-swagger.js';
import { ValidationPipe } from '@nestjs/common';
import "dotenv/config";
import { ProblemDetailsFilter } from './filters/problem-details.filter.js';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureSwagger(app);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: false,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalFilters(new ProblemDetailsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
