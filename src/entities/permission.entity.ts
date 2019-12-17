import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  action: string;

  @Column({
    unique: true
  })
  identify: string;

  @ManyToMany(type => Role, role => role.permissions)
  roles: Role[];
}
