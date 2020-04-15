import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import {CaseEntity} from '../case/case.entity';
import {PlatformCodeEntity} from "./platformCode.entity";

@Entity('catalog')
export class CatalogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @Column()
    name: string;

    @Column({default: false})
    isPub: boolean;

    @Column({default: null, nullable: true})
    parentId: number;


    @OneToMany(type => CaseEntity, cases => cases.catalog)
    cases: CaseEntity[];


    @ManyToOne(type => PlatformCodeEntity, platformCode => platformCode.catalog)
    platformCode: PlatformCodeEntity;
}
