import {Module} from '@nestjs/common';
import {JmeterController} from './jmeter.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JmeterService} from "./jmeter.service";
import {JmeterEntity} from "./jmeter.entity";
import { JmeterGateway } from './jmeter.websocket';

@Module({
    imports: [TypeOrmModule.forFeature([JmeterEntity])],
    controllers: [JmeterController],
    providers: [JmeterService],
})
export class JmeterModule {
}
