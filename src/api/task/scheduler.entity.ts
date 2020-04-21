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
import {CaseGrade, RunStatus, TaskType} from "../../config/base.enum";
import { TaskResultEntity } from "./task_result.entity";
import {CatalogEntity} from "../catalog/catalog.entity";

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


    @Column('enum',{default: CaseGrade.LOW, nullable: false, enum: CaseGrade, comment: '用例等级'})
    caseGrade: CaseGrade;

    @ManyToOne(type => EnvEntity, env => env.sechedulers, {cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn()
    env: EnvEntity;

    @Column('enum', {default: RunStatus.STOP, nullable: false, comment: '定时任务状态', enum: RunStatus})
    status: RunStatus;

    @Column('enum', {default: TaskType.INTERFACE, nullable: false, comment: '定时任务类型', enum: TaskType})
    taskType: TaskType;

    @Column({nullable: false})
    cron: string;

    @OneToMany(type => TaskResultEntity, taskResults => taskResults.scheduler)
    taskResults: TaskResultEntity[];

    @Column({default: false})
    isSendMessage: boolean;

   @ManyToMany(type => CatalogEntity, catalogs => catalogs.scheduler,{cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
   @JoinTable()
   catalogs: CatalogEntity[];

}
