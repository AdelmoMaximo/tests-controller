import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PdcaA3Entity } from "../entities/pdcaa3.entity";

export class CreatePdcaA3Dto extends OmitType(PdcaA3Entity,['pdcaa3_id']){
    @ApiProperty()
    a3_registry_id: number;
}