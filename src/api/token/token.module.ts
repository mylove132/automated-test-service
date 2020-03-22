import { Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {TokenEntity} from "./token.entity";
import {TokenService} from "./token.service";
import {TokenController} from "./token.controller";
import {EnvEntity} from "../env/env.entity";


@Module({
    imports: [ TypeOrmModule.forFeature([TokenEntity, EnvEntity])],
    providers: [TokenService],
    controllers: [
        TokenController
    ]
})
export class TokenModule {

}
