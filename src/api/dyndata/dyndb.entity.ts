import {Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { DynSqlEntity } from './dynsql.entity';
import { type } from 'os';

@Entity('dyn_db')
export class DynDbEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({comment:'数据库名称', nullable: false})
    dbName: string;

    @Column({comment: '数据库host', nullable: false})
    dbHost: string;

    @Column({comment: '数据库端口', nullable: false})
    dbPort: number;

    @Column({comment: '数据库用户名', nullable: false})
    dbUsername: string;

    @Column({comment: '数据库密码', nullable: false})
    dbPassword: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @OneToMany(type => DynSqlEntity, dynSqls => dynSqls.dynDb)
    dynSqls: DynSqlEntity[];

    @Column({default: false})
    isRealDelete: boolean;
}
