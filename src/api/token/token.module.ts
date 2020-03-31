import { Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {TokenEntity} from "./token.entity";
import {TokenService} from "./token.service";
import {TokenController} from "./token.controller";
import {EnvEntity} from "../env/env.entity";
import {PlatformCodeEntity} from "../catalog/platformCode.entity";


@Module({
    imports: [ TypeOrmModule.forFeature([TokenEntity, EnvEntity, PlatformCodeEntity])],
    providers: [TokenService],
    controllers: [
        TokenController
    ]
})
export class TokenModule {

}
