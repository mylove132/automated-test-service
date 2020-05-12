import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn, Binary, ManyToOne, ManyToMany} from 'typeorm';
import {JmeterResultEntity} from "./jmeter_result.entity";
import { SchedulerEntity } from '../task/scheduler.entity';
import { type } from 'os';

@Entity('jmeter')
export class JmeterEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    //压测时长（ms）
    @Column({comment: '压测时长'})
    preCountTime: number;

    //压测并发数
    @Column({comment: '压测线程数'})
    preCountNumber: number;

    @Column({default: -1,comment:'循环次数'})
    loopNum: number;

    @Column({nullable: true})
    url: string;

    // @OneToMany(type => CaseEntity, cases => cases.jmeter)
    // cases: CaseEntity[];

    @Column({nullable: true})
    remote_address: string;

    @OneToMany(type => JmeterResultEntity, jmeterResults => jmeterResults.jmeter)
    jmeterResults: JmeterResultEntity[];

    @Column({default: false})
    isRealDelete: boolean;

    @ManyToMany(type => SchedulerEntity, scheduler => scheduler.jmeters)
    schedulers: SchedulerEntity[];
}
















































































































































































































































































































































































































































































































