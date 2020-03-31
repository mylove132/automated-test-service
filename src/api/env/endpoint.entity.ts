import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {EnvEntity} from './env.entity';
import {CaseEntity} from '../case/case.entity';
import {TokenEntity} from "../token/token.entity";
@Unique(['endpoint'])
@Entity('endpoint')
export class EndpointEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    endpoint: string;

    @ManyToMany(type => EnvEntity, env => env.endpoints, {cascade: true,onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    @JoinTable()
    envs: EnvEntity[];

    @OneToMany(type => CaseEntity, cas => cas.endpointObject)
    cases: CaseEntity[];


}
