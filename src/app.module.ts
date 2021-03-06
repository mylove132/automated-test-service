import {DynamicModule, Module} from '@nestjs/common';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {AppController} from './app.controller';
import {UserModule} from './api/user/user.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Connection} from 'typeorm';
import {EnvModule} from './api/env/env.module';
import {ConfigService} from "./config/config.service";
import {ConfigModule} from "./config/config.module";
import {CatalogModule} from "./api/catalog/catalog.module";
import {CaseModule} from './api/case/case.module';
import {RunModule} from './api/run/run.module';
import {SchedulerModule} from './api/task/scheduler.module';
import {ScheduleModule} from '@nestjs/schedule';
import {AuthGuard} from './shared/guard/auth.guard';
import {HistoryModule} from './api/history/history.module';
import {JmeterModule} from "./api/jmeter/jmeter.module";
import {TokenModule} from "./api/token/token.module";
import {OperateModule} from "./api/operate/operate.module";
import {TransformInterceptor} from "./shared/interceptor/transform.interceptor";
import {HttpExceptionFilter} from "./shared/filters/http-exception.filter";
import {AllExceptionsFilter} from "./shared/filters/any-exception.filter";
import {RequestIdGuard} from "./shared/guard/requestId.guard";
import { DynDataModule } from './api/dyndata/dyndata.module';
import { SocketModule } from './socket/socket.module';

const Orm = (): DynamicModule => {
    console.log('连接数据库中....');
    const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
    return TypeOrmModule.forRoot(config.getTypeOrmConfig());
};

const modules = [
    ScheduleModule.forRoot(), //开启定时任务服务
    ConfigModule,
    Orm(),
    CaseModule,
    CatalogModule,
    UserModule,
    EnvModule,
    RunModule,
    HistoryModule,
    JmeterModule,
    SchedulerModule,
    TokenModule,
    OperateModule,
    DynDataModule,
    SocketModule
];

const provides = [
    {
        provide: APP_GUARD,
        useClass: RequestIdGuard,
    },
    {
        provide: APP_GUARD,
        useClass: AuthGuard,
    },
    {
        provide: APP_INTERCEPTOR,
        useClass: TransformInterceptor,
    },
    {
        provide: APP_FILTER,
        useClass: AllExceptionsFilter,
    },
    {
        provide: APP_FILTER,
        useClass: HttpExceptionFilter,
    },
];

@Module({
    imports: [
        ...modules
    ],
    controllers: [
        AppController
    ],
    providers: [
        // 全局绑定守卫
        ...provides
    ]
})
export class ApplicationModule {
    constructor(private readonly connection: Connection) {
    }
}
