import { a3_causeEntity } from 'src/cause/entities/a3_cause.entity';
import { PdcaEntity } from 'src/pdca/entities/pdca.entity';
import { PdcaA3Entity } from 'src/pdca/entities/pdcaa3.entity';
import { SolutionCauseEntity } from 'src/solution/entities/solution-cause.entity';
import { SolutionSubcauseEntity } from 'src/solution/entities/solution-subcause.entity';
import { a3_subcauseEntity } from 'src/subcause/entities/a3_subcause.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('A3_REGISTRY')
export class a3_registryEntity{
    @PrimaryGeneratedColumn()
    a3_registry_id: number;

    @Column()
    a3_registry_name: string;

    @Column()
    a3_registry_description: string;

    @Column()
    a3_registry_user: string;

    @Column()
    a3_registry_createad: Date;

    @Column()
    a3_registry_lastModified: Date;

    @Column()
    a3_registry_status:number;

    @OneToMany(() => PdcaA3Entity, (Pdca) => Pdca.registry)
    pdcaA3!: PdcaA3Entity[];

    @OneToMany(() => a3_subcauseEntity, (sub) => sub.registry)
    a3_subcauses!: a3_subcauseEntity[];

    @OneToMany(() => a3_causeEntity, (sub) => sub.registry)
    a3_causes!: a3_causeEntity[];

    @OneToMany(() => SolutionSubcauseEntity, (subsol) => subsol.registry)
    subsoluctions!: SolutionSubcauseEntity[];

    @OneToMany(() => SolutionCauseEntity, (solution) => solution.registry)
    soluctions!: SolutionCauseEntity[];
}