import {Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from 'typeorm';
import {CaselistEntity} from '../caselist/caselist.entity';
import {EnvEntity} from '../env/env.entity';

@Unique(['md5'])
@Entity('secheduler')
export class SchedulerEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    md5: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @OneToOne(type => CaselistEntity,caselist => caselist.secheduler)
    @JoinColumn()
    caseList: CaselistEntity;

    @OneToOne(type => EnvEntity,env => env.secheduler)
    @JoinColumn()
    env: EnvEntity;
}
