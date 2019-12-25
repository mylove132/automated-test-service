import {DynamicModule, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ConfigService } from "./config/config.service";
import { ConfigModule } from "./config/config.module";
import { CatalogModule } from "./api/catalog/catalog.module";
import { CaseModule } from './api/case/case.module';
import { RunModule } from './api/run/run.module';

const Orm = (): DynamicModule => {
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  return TypeOrmModule.forRoot(config.getTypeOrmConfig());
}

@Module({
  imports: [
    ConfigModule,
    Orm(),
    CaseModule,
    CatalogModule,
    UserModule,
    RunModule,
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
