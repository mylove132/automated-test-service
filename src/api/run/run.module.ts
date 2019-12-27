import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseEntity } from '../case/case.entity';

import { RunService } from './run.service';
import { RunController } from './run.controller';
import { CurlModule } from '../curl/curl.module'
import { EndpointEntity } from '../env/endpoint.entity';
import { EnvEntity } from '../env/env.entity';

@Module({
  imports: [CurlModule, TypeOrmModule.forFeature([CaseEntity, EnvEntity, EndpointEntity])],
  providers: [RunService],
  controllers: [RunController],
})
export class RunModule {}