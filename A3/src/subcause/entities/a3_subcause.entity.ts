import { a3_causeEntity } from 'src/cause/entities/a3_cause.entity';
import { a3_registryEntity } from 'src/registry/entities/a3_registry.entity';
import { SolutionSubcauseEntity } from 'src/solution/entities/solution-subcause.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('A3_SUBCAUSE')
export class a3_subcauseEntity{
    @PrimaryGeneratedColumn()
    a3_subcause_id: number;

    @Column()
    a3_subcause_description: string;

    @Column()
    a3_registry_id: number;

    @Column()
    a3_cause_id: number;

    @ManyToOne(() => a3_registryEntity, (user) => user.a3_subcauses)
    @JoinColumn({name: 'a3_registry_id'})
    registry:a3_registryEntity;

    @ManyToOne(() => a3_causeEntity, (cause) => cause.a3_subcauses)
    @JoinColumn({name: 'a3_cause_id'})
    cause:a3_causeEntity;

    @OneToMany(() => SolutionSubcauseEntity, (subsol) => subsol.subcause)
    subsoluctions!: SolutionSubcauseEntity[];

}