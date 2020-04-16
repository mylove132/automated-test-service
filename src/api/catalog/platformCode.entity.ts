import {
    Entity,
    PrimaryGeneratedColumn,
    Column, OneToMany, ManyToOne
} from 'typeorm';
import {CatalogEntity} from "./catalog.entity";
import {TokenEntity} from "../token/token.entity";
import {SchedulerEntity} from "../task/scheduler.entity";

@Entity('platform_code')
export class PlatformCodeEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: "000", comment: "平台code码", nullable: false})
    platformCode: string;

    @Column({nullable: true})
    name: string;

    @OneToMany(type => CatalogEntity, catalog => catalog.platformCode)
    catalog: CatalogEntity[];

    @OneToMany(type => TokenEntity, tokens => tokens.platformCode)
    tokens: TokenEntity[];
}
