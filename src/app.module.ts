import {DynamicModule, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import {ConfigService} from "./config/config.service";
import {ConfigModule} from "./config/config.module";
import {CatalogModule} from "./api/catalog/catalog.module";
import {CaseModule} from './api/case/case.module';
import {EnvModule} from './api/env/env.module';
import {CaseListModule} from './api/caselist/caselist.module';
import {SchedulerModule} from './api/task/scheduler.module';
import {ScheduleModule} from '@nestjs/schedule';
import {WsModule} from './api/ws/ws.module';

const Orm = (): DynamicModule => {
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  return TypeOrmModule.forRoot(config.getTypeOrmConfig());
};



@Module({
  imports: [
    ScheduleModule.forRoot(), //开启定时任务服务
    ConfigModule,
    Orm(),
    CaseModule,
    CatalogModule,
    UserModule,
    EnvModule,
    CaseListModule,
    SchedulerModule,
    WsModule
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
