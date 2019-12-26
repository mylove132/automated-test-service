import {DynamicModule, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
<<<<<<< HEAD
import {ConfigService} from "./config/config.service";
import {ConfigModule} from "./config/config.module";
import {CatalogModule} from "./api/catalog/catalog.module";
import {CaseModule} from './api/case/case.module';
import {EnvModule} from './api/env/env.module';
import {CaseListModule} from './api/caselist/caselist.module';
=======
import { ConfigService } from "./config/config.service";
import { ConfigModule } from "./config/config.module";
import { CatalogModule } from "./api/catalog/catalog.module";
import { CaseModule } from './api/case/case.module';
import { RunModule } from './api/run/run.module';
>>>>>>> 48966119dc84bcedfa7b51b6f6d314c1de6c07b9

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
<<<<<<< HEAD
    EnvModule,
    CaseListModule
=======
    RunModule,
>>>>>>> 48966119dc84bcedfa7b51b6f6d314c1de6c07b9
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {
  constructor(private readonly connection: Connection) {}
}
