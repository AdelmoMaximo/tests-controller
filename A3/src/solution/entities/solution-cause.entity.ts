import { a3_causeEntity } from 'src/cause/entities/a3_cause.entity';
import { a3_registryEntity } from 'src/registry/entities/a3_registry.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('SOLUCTION_CASUE')
export class SolutionCauseEntity {
  @PrimaryGeneratedColumn()
  soluction_case_id: number;

  @Column()
  soluction_cause_description: string;

  @Column()
  soluction_cause_created: Date;

  @Column()
  a3_registry_id: number;

  @Column()
  a3_cause_id: number;

  @Column()
  a3_user: string;

  @ManyToOne(() => a3_registryEntity, (user) => user.soluctions)
  @JoinColumn({name: 'a3_registry_id'})
  registry:a3_registryEntity;

  @ManyToOne(() => a3_causeEntity, (cause) => cause.soluctions)
  @JoinColumn({name: 'a3_cause_id'})
  cause:a3_causeEntity;
}
