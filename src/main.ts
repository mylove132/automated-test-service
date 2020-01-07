import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ConfigService} from "./config/config.service";
import {join} from "path";
import {HttpExceptionFilter} from "./shared/filters/http.exception.filter";
import {TransformInterceptor} from "./shared/filters/http.response.filter";
import {ValidationPipe} from './shared/pipes/validation.pipe';
var log4js = require('log4js');

async function bootstrap() {
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  log4js.configure(join(__dirname,'../log4js.json'));
  const app = await NestFactory.create(ApplicationModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api');
  app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
  const options = new DocumentBuilder()
    .setTitle('automated test service App')
    .setDescription('The automated API description')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  var logger = require('log4js').getLogger("main");
  logger.info(`automated-test-server start ..... port: ${config.port}`);
  await app.listen(config.port);
}
bootstrap();
