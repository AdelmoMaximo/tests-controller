import { ModelsComponentEntity } from "src/models/entities/models-component.entity";
import { Column, Entity , OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('COMPONENT')
export class ComponentEntity{
    @PrimaryGeneratedColumn()
    component_id: number;

    @Column()
    component_descrition:string;

    @OneToMany(() => ModelsComponentEntity, (ModelComponent) => ModelComponent.component)
    component_models!: ModelsComponentEntity[];
}