import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ProblemDetailsExceptionFilter } from '@ux-lib-csr/nestjs-utils';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new ProblemDetailsExceptionFilter());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Fantasy API is running on: http://localhost:${port}`);
}

bootstrap();
