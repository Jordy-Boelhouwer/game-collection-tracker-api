import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExcludeNullInterceptor } from './utils/excludeNull.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ExcludeNullInterceptor());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
