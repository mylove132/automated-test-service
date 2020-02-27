import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    TreeChildren, TreeParent, Tree, OneToMany, OneToOne, JoinColumn
} from 'typeorm';
import {UserEntity} from "../user/user.entity";
import {CaseEntity} from '../case/case.entity';
import {SceneEntity} from "../scene/scene.entity";
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


    @OneToMany(type => SceneEntity, cases => cases.catalog)
    scenes: SceneEntity[];

    @OneToOne(type => PlatformCodeEntity,platformCode =>platformCode.catalog)
    @JoinColumn()
    platformCode: PlatformCodeEntity;
}
