import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from 'typeorm';
import {CaselistEntity} from '../caselist/caselist.entity';
import {EnvEntity} from '../env/env.entity';
import {RunStatus} from './dto/run.status';
import {CaseEntity} from "../case/case.entity";
import {IsString} from "class-validator";

@Unique(['md5','name'])
@Entity('secheduler')
export class SchedulerEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column()
    md5: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @OneToMany(type => CaseEntity, cases => cases.secheduler)
    cases: CaseEntity[];

    @ManyToOne(type => EnvEntity,env => env.sechedulers,{cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    @JoinColumn()
    env: EnvEntity;

    @Column('enum', {default: RunStatus.STOP, nullable:false, comment: '定时任务状态', enum: RunStatus})
    status: RunStatus;

    @Column({nullable:false})
    cron: string;
}
