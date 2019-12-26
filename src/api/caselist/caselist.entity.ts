import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {CaseEntity} from '../case/case.entity';

@Entity('caselist')
export class CaselistEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({comment: '用例集合名称'})
    name: string

    @ManyToMany(type => CaseEntity, cases => cases.caseLists)
    @JoinTable()
    cases: CaseEntity[]

    @Column({nullable: true, comment: '用例描述'})
    desc: string
}
