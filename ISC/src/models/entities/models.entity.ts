import { SupplierEntity } from "src/supplier/entities/supplier.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ModelsComponentEntity } from "./models-component.entity";
import { NoScheduleStopEntity } from "src/no-schedule-stop/entities/no-schedule-stop.entity";


@Entity('MODELS')
export class ModelsEntity{
    @PrimaryGeneratedColumn()
    models_id:number;

    @Column()
    models_name:string;

    @Column()
    models_identity:string;

    @Column()
    supplier_id:number;

    @Column()
    models_create_user:string;

    @Column()
    models_create_date: Date;

    @Column()
    models_update_user:string;

    @Column()
    models_update_date: Date;

    @ManyToOne(() => SupplierEntity, (supplier) => supplier.Models)
    @JoinColumn({name: 'supplier_id'})
    supplier:SupplierEntity;

    @OneToMany(() => ModelsComponentEntity, (ModelComponent) => ModelComponent.model)
    models_component!: ModelsComponentEntity[];

    @OneToMany(() => NoScheduleStopEntity, (models) => models.user)
    no_schedule_stop!: NoScheduleStopEntity[];
    
}