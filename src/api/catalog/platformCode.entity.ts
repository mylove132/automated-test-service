import {
    Entity,
    PrimaryGeneratedColumn,
    Column, OneToMany
} from 'typeorm';
import {CatalogEntity} from "./catalog.entity";

@Entity('platform_code')
export class PlatformCodeEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: "000", comment: "平台code码", nullable: false})
    platformCode: string;

    @OneToMany(type => CatalogEntity, catalog => catalog.platformCode)
    catalog: CatalogEntity[];

}
