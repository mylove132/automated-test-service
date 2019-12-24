import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {RequestStatusEnum} from './dto/request.enum';
import {CaseEntity} from '../case/case.entity';


@Entity('history')
export class HistoryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createDate: Date;

    @Column('enum',{default: RequestStatusEnum.SUCCESS, nullable:false, comment: '请求结果', enum: RequestStatusEnum })
    status: RequestStatusEnum;

    @ManyToOne(type => CaseEntity, cases => cases.histories)
    case: CaseEntity;
}
















































































































































































































































































































































































































































































































