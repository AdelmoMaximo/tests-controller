import { PdcaEntity } from 'src/pdca/entities/pdca.entity';
import { PdcaA3Entity } from 'src/pdca/entities/pdcaa3.entity';
import { a3_registryEntity } from 'src/registry/entities/a3_registry.entity';
import { SolutionCauseEntity } from 'src/solution/entities/solution-cause.entity';
import { SolutionSubcauseEntity } from 'src/solution/entities/solution-subcause.entity';
import { a3_subcauseEntity } from 'src/subcause/entities/a3_subcause.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity('A3_CAUSE')
export class a3_causeEntity{
    @PrimaryGeneratedColumn()
    a3_cause_id: number;

    @Column()
    a3_cause_category: string;

    @Column()
    a3_cause_description: string;

    @Column()
    a3_registry_id: number;

    @OneToMany(() => PdcaEntity, (Pdca) => Pdca.cause)
    pdca!: PdcaEntity[];

    @OneToMany(() => SolutionCauseEntity, (sub) => sub.cause)
    soluctions!: SolutionCauseEntity[];

    @OneToMany(() => a3_subcauseEntity, (sub) => sub.cause)
    a3_subcauses!: a3_subcauseEntity[];

    @OneToMany(() => SolutionSubcauseEntity, (sub) => sub.cause)
    subcauses_soluctions!: SolutionSubcauseEntity[];

    @ManyToOne(() => a3_registryEntity, (user) => user.a3_causes)
    @JoinColumn({name: 'a3_registry_id'})
    registry:a3_registryEntity;
}