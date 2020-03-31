import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ConfigService} from "./config/config.service";
import * as express from 'express';
import { logger } from './shared/middleware/logger.middleware';
import {ValidationPipe} from './shared/pipes/validation.pipe';
import {Logger} from "./utils/log4js";


async function bootstrap() {
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  const app = await NestFactory.create(ApplicationModule, {cors: true});
  app.use(express.json()); // For parsing application/json
  // 监听所有的请求路由，并打印日志
  app.use(logger);
  app.useGlobalPipes(new ValidationPipe());
  // 使用拦截器打印出参
  // app.useGlobalInterceptors(new TransformInterceptor());
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
  Logger.info(`服务启动成功,端口：${config.port}..................`)
}
bootstrap();
