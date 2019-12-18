import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Path from 'path';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './api/user/module/user.module';

const Orm = (): DynamicModule => {
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  console.log(config.getTypeOrmConfig())
  return TypeOrmModule.forRoot(config.getTypeOrmConfig());
}

@Module({
  imports: [
    ConfigModule,
    Orm(),
    UserModule
  ]
})
export class AppModule { }
