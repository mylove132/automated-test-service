import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { UserModule } from './api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { EnvModule } from './api/env/env.module';
import { CaseListModule } from './api/caselist/caselist.module';
import { ConfigService } from "./config/config.service";
import { ConfigModule } from "./config/config.module";
import { CatalogModule } from "./api/catalog/catalog.module";
import { CaseModule } from './api/case/case.module';
import { RunModule } from './api/run/run.module';
import { SchedulerModule } from './api/task/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WsModule } from './api/ws/ws.module';
import { AuthGuard } from './shared/guard/auth.guard';
import { HistoryModule } from './api/history/history.module';

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
    WsModule,
    RunModule,
    HistoryModule,
    SchedulerModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    // 全局绑定守卫
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ]
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
