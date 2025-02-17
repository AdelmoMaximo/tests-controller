import { ModelsEntity } from "src/models/entities/models.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('SUPPLIER')
export class SupplierEntity{
    @PrimaryGeneratedColumn()
    supplier_id:number;

    @Column()
    supplier_codigo:string;

    @Column()
    supplier_abbreviation:string;

    @Column()
    supplier_name:string;

    @OneToMany(() => ModelsEntity, (models) => models.supplier)
    Models!: ModelsEntity[];
    
}