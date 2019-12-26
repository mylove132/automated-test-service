import { Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {EnvEntity} from './env.entity';
import {EndpointEntity} from './endpoint.entity';
import {EnvService} from './env.service';
import {EnvController} from './env.controller';




@Module({
    imports: [TypeOrmModule.forFeature([EnvEntity, EndpointEntity])],
    providers: [EnvService],
    controllers: [
        EnvController
    ]
})
export class EnvModule {

}
