import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import {EnvEntity} from '../env/env.entity';
import {CaseEntity} from "../case/case.entity";
import {RunStatus} from "../../config/base.enum";
import { TaskResultEntity } from "./task_result.entity";

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

    @ManyToMany(type => CaseEntity, cases => cases.sechedulers, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinTable()
    cases: CaseEntity[];

    @ManyToOne(type => EnvEntity, env => env.sechedulers, {cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn()
    env: EnvEntity;

    @Column('enum', {default: RunStatus.STOP, nullable: false, comment: '定时任务状态', enum: RunStatus})
    status: RunStatus;

    @Column({nullable: false})
    cron: string;

    @OneToMany(type => TaskResultEntity, taskResults => taskResults.scheduler)
    taskResults: TaskResultEntity[];

    @Column({default: false})
    isSendMessage: boolean;
}
