import { a3_causeEntity } from 'src/cause/entities/a3_cause.entity';
import { a3_registryEntity } from 'src/registry/entities/a3_registry.entity';
import { a3_subcauseEntity } from 'src/subcause/entities/a3_subcause.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity('SOLUCTION_SUBCAUSE')
export class SolutionSubcauseEntity {
  @PrimaryGeneratedColumn()
  soluction_subcase_id: number;

  @Column()
  soluction_subcause_description: string;

  @Column()
  soluction_subcause_created: Date;

  @Column()
  a3_registry_id: number;

  @Column()
  a3_cause_id: number;

  @Column()
  a3_user: string;

  @Column()
  a3_subcause_id: number;

  @ManyToOne(() => a3_registryEntity, (user) => user.subsoluctions)
  @JoinColumn({name: 'a3_registry_id'})
  registry:a3_registryEntity;

  @ManyToOne(() => a3_causeEntity, (cause) => cause.subcauses_soluctions)
  @JoinColumn({name: 'a3_cause_id'})
  cause:a3_causeEntity;

  @ManyToOne(() => a3_subcauseEntity, (cause) => cause.subsoluctions)
  @JoinColumn({name: 'a3_subcause_id'})
  subcause:a3_subcauseEntity;
}

