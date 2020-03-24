import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ConfigService} from "./config/config.service";
import * as express from 'express';
import { logger } from './shared/middleware/logger.middleware';
import {ValidationPipe} from './shared/pipes/validation.pipe';
import {TransformInterceptor} from "./shared/interceptor/transform.interceptor";
import {HttpExceptionFilter} from "./shared/filters/http-exception.filter";

async function bootstrap() {
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  const app = await NestFactory.create(ApplicationModule, {cors: true});
  app.use(express.json()); // For parsing application/json
  // 监听所有的请求路由，并打印日志
  app.use(logger);
  app.useGlobalPipes(new ValidationPipe());
  // 使用拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('automated test service App')
    .setDescription('The automated API description')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  await app.listen(config.port);
}
bootstrap();
