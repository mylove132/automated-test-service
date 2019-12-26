import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {EndpointEntity} from './endpoint.entity';

@Entity('env')
export class EnvEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => EndpointEntity, endpoint => endpoint.envs)
    endpoints: EndpointEntity[];
}
