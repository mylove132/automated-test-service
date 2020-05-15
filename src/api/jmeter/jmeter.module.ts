import {Module} from '@nestjs/common';
import {JmeterController} from './jmeter.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JmeterService} from "./jmeter.service";
import {JmeterEntity} from "./jmeter.entity";
import { JmeterResultEntity } from './jmeter_result.entity';

@Module({
    imports: [TypeOrmModule.forFeature([JmeterEntity, JmeterResultEntity])],
    controllers: [JmeterController],
    providers: [JmeterService],
})
export class JmeterModule {
}
