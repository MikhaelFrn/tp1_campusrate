import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { VersioningType } from '@nestjs/common';
import { configureSwagger } from './configure-swagger.js';
import { ValidationPipe } from '@nestjs/common';
import "dotenv/config";
import { ProblemDetailsFilter } from './common/filters/problem-details.filter.js';
import helmet from 'helmet';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureSwagger(app);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ProblemDetailsFilter());
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: false,
    }),
  );
  app.use(helmet());
  app.useSecurityHeaders();
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4200', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(json({ limit: '1mb' }));
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
