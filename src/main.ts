import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ConfigService} from "./config/config.service";
import * as express from 'express';
import {ValidationPipe} from './shared/pipes/validation.pipe';
import {Logger} from "./utils/log4js";
import { RedisIoAdapter } from './socket/socket.adapter';
import { Redis } from 'ioredis';
import { REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis/redis.constants';


async function bootstrap() {
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  const app = await NestFactory.create(ApplicationModule, {cors: true});
  app.use(express.json()); // For parsing application/json
  app.useGlobalPipes(new ValidationPipe());

  const pubClient: Redis = app.get(REDIS_PUBLISHER_CLIENT);
  const subClient: Redis = app.get(REDIS_SUBSCRIBER_CLIENT);

  app.useWebSocketAdapter(new RedisIoAdapter(app, subClient, pubClient));
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
