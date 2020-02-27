import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne, Unique
} from 'typeorm';
import {CatalogEntity} from "./catalog.entity";

@Unique(["platformCode"])
@Entity('platform_code')
export class PlatformCodeEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: "000", comment: "平台code码", nullable: false})
    platformCode: string;

    @OneToOne(type => CatalogEntity, catalog => catalog.platformCode)
    catalog: CatalogEntity;

}
