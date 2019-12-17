import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from './logs/custom.log';
import { join } from "path";
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { TransformInterceptor } from './common/filters/http.response.filter';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  console.log();
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  Logger.setup(Logger.defaultName, config.logDir);
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('/api');
  await app.listen(config.port);
}
bootstrap();
