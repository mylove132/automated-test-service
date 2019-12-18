import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { TransformInterceptor } from './common/filters/http.response.filter';
import { ConfigService } from './config/config.service';
import {join} from 'path';
var log4js = require('log4js');

async function bootstrap() {
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  log4js.configure(join(__dirname,'../log4js.json'));
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('/api');
  app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
  var logger = require('log4js').getLogger("main");
  logger.info(`automated-test-server start ..... port: ${config.port}`);
  await app.listen(config.port);
}
bootstrap();
