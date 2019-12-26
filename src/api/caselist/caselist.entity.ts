import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {CaseEntity} from '../case/case.entity';
import {EnvEntity} from '../env/env.entity';

@Entity('caselist')
export class CaselistEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({comment: '用例集合名称'})
    name: string

    @ManyToMany(type => CaseEntity, cas => cas.caseLists)
    cases: CaseEntity[]

    @Column({nullable: true, comment: '用例描述'})
    desc: string

    @Column({nullable:true,comment:'cron表达式'})
    cron: string;

    @Column({default: false,comment:'是否是定时任务'})
    isTask: boolean;

    @ManyToOne(type => EnvEntity, env => env.caseLists,{cascade: true})
    env: EnvEntity;
}
