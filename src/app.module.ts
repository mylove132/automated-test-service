import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Path from 'path';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './api/user/module/user.module';

const Orm = (): DynamicModule => {
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);

  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: config.databaseHost,
    port: config.databasePort,
    username: config.databaseUserName,
    password: config.databasePassword,
    database: config.databaseName,
    entities: [__dirname + '/entities/*.entity{.ts,.js}'],
    synchronize: config.databaseSynchronize
  });
}

@Module({
  imports: [
    ConfigModule,
    Orm(),
    UserModule
  ]
})
export class AppModule { }
