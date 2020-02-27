import {BullModule} from '@nestjs/bull';
import {Module} from '@nestjs/common';
import {JmeterController} from './jmeter.controller';
import {JmeterProcessor} from './jmeter.processor';
import {CaseEntity} from "../case/case.entity";
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'jmeter',
        }),
        TypeOrmModule.forFeature([CaseEntity])
    ],
    controllers: [JmeterController],
    providers: [JmeterProcessor],
})
export class JmeterModule {
}
