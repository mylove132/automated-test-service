import { Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { DynSqlEntity } from './dynsql.entity';
import { DynDbEntity } from './dyndb.entity';
import { DynDataService } from './dyndata.service';
import { DynDataController } from './dyndata.controller';


@Module({
    imports: [TypeOrmModule.forFeature([DynSqlEntity, DynDbEntity])],
    providers: [DynDataService],
    controllers: [
        DynDataController
    ],
    exports: [DynDataService]
})

export class DynDataModule {

}
