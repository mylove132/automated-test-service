import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique} from 'typeorm';
import { type } from 'os';
import { DynDbEntity } from './dyndb.entity';

@Unique(['sqlAlias'])
@Entity('dyn_sql')
export class DynSqlEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {comment: 'sql语句', nullable: true})
    sql: string;

    @Column()
    name: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @Column({comment: '结果属性字段', nullable: true})
    resultFields: string;

    @ManyToOne(type => DynDbEntity, dynDb => dynDb.dynSqls )
    dynDb: DynDbEntity;

    @Column({nullable: true, comment:'sql别名'})
    sqlAlias: string;

    @Column({default: false})
    isRealDelete: boolean;
}
