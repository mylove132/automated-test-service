import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SchedulerEntity } from "./scheduler.entity";

@Entity('task_result')
export class TaskResultEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text',{comment: '执行结果'})
    result: object;

    @CreateDateColumn()
    createDate: Date;

    @ManyToOne(type => SchedulerEntity, scheduler => scheduler.taskResults, {cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    scheduler: SchedulerEntity;
}
