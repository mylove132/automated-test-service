import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { type } from 'os';
import { DynDbEntity } from './dyndb.entity';

@Entity('dyn_sql')
export class DynSqlEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({comment: 'sql语句'})
    sql: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @Column({comment: '结果属性字段'})
    resultFields: string;

    @ManyToOne(type => DynDbEntity, dynDb => dynDb.dynSqls )
    dynDb: DynDbEntity;

}
