import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {RequestStatusEnum, Executor} from './dto/history.enum';
import {CaseEntity} from '../case/case.entity';


@Entity('history')
export class HistoryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createDate: Date;

    @Column('enum',{default: RequestStatusEnum.SUCCESS, nullable:false, comment: '请求结果', enum: RequestStatusEnum })
    status: RequestStatusEnum;

    @ManyToOne(type => CaseEntity, cases => cases.histories, {cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    case: CaseEntity;

    @Column('enum',{default: Executor.MANUAL, nullable:false, comment: '执行者', enum: Executor })
    executor: Executor;
}
















































































































































































































































































































































































































































































































