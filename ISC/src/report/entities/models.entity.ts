import { Column, ViewEntity } from "typeorm";

@ViewEntity('modelos')
export class Models{
    @Column()
    name:string;
}