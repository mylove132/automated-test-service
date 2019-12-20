import {DynamicModule, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './api/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import {ConfigService} from "./config/config.service";
import {ConfigModule} from "./config/config.module";
import {CatalogModule} from "./api/catalog/catalog.module";

const Orm = (): DynamicModule => {
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);

  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: config.databaseHost,
    port: config.databasePort,
    username: config.databaseUserName,
    password: config.databasePassword,
    database: config.databaseName,
    entities: ["src/api/**/**.entity{.ts,.js}"],
    synchronize: config.databaseSynchronize,
    logging: "all",
    logger: "file"
  });
}

@Module({
  imports: [
    // ConfigModule,
    // Orm(),
    // CatalogModule,
    // UserModule,
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {
  // constructor(private readonly connection: Connection) {}
}
