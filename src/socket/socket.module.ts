import { Module } from '@nestjs/common';

import { SocketGateway } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JmeterEntity } from '../api/jmeter/jmeter.entity';
import { JmeterResultEntity } from '../api/jmeter/jmeter_result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JmeterEntity, JmeterResultEntity])],
  providers: [
    SocketGateway,
  ],
  exports: [SocketGateway],
  controllers: [],
})
export class SocketModule {}
