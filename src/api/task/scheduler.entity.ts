import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from 'typeorm';
import {CaselistEntity} from '../caselist/caselist.entity';
import {EnvEntity} from '../env/env.entity';
import {RunStatus} from './dto/run.status';

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

    @ManyToOne(type => CaselistEntity,caselist => caselist.sechedulers,{cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    @JoinColumn()
    caseList: CaselistEntity;

    @ManyToOne(type => EnvEntity,env => env.sechedulers,{cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    @JoinColumn()
    env: EnvEntity;

    @Column('enum', {default: RunStatus.STOP, nullable:false, comment: '定时任务状态', enum: RunStatus})
    status: RunStatus;
}
