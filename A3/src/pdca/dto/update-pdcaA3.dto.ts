import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PdcaA3Entity } from "../entities/pdcaa3.entity";

export class UpdatePdcaA3Dto extends OmitType(PdcaA3Entity,['a3_registry_id','pdcaa3_is_close','pdcaa3_last_modified','pdcaa3_status']){
    @ApiProperty()
    pdcaa3_justification: string;
}