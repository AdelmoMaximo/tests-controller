import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelsEntity } from "./models.entity";
import { ComponentEntity } from "src/component/entities/component.entity";

@Entity('MODELS_COMPONENT')
export class ModelsComponentEntity{
    @PrimaryGeneratedColumn()
    models_component_id:number;

    @Column()
    models_id:number;

    @Column()
    component_id:number;

    @ManyToOne(() => ModelsEntity, (models) => models.models_component)
    @JoinColumn({name: 'models_id'})
    model:ModelsEntity;

    @ManyToOne(() => ComponentEntity, (component) => component.component_models)
    @JoinColumn({name: 'component_id'})
    component:ComponentEntity;
}