import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PdcaEntity } from "../entities/pdca.entity";

export class CreatePdcaDto extends OmitType(PdcaEntity, ['cause']){
    @ApiProperty()
    pdca_what: string;

    @ApiProperty()
    pdca_why: string;

    @ApiProperty()
    pdca_where: string;

    @ApiProperty()
    pdca_when: Date;

    @ApiProperty()
    pdca_when_end: Date;

    @ApiProperty()
    user_id: number;

    @ApiProperty()
    pdca_how: string;

    @ApiProperty()
    pdca_how_much: number;

    @ApiProperty()
    pdcaa3_id: number;

    @ApiProperty()
    a3_cause_id: number;
}