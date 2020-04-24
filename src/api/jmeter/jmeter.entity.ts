import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from 'typeorm';
import {CaseEntity} from "../case/case.entity";

@Unique(['md5'])
@Entity('jmeter')
export class JmeterEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    //压测时长（ms）
    @Column()
    preCountTime: number;

    //压测并发数
    @Column()
    preCountNumber: number;

    //压测结果ID
    @Column()
    preResultId: string;

    @Column()
    md5: string;

    @OneToMany(type => CaseEntity, cases => cases.jmeter)
    cases: CaseEntity[];

}
















































































































































































































































































































































































































































































































