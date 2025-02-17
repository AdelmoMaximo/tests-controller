import { ApiProperty, OmitType } from "@nestjs/swagger";
import { DefectEntity } from "../entities/defect.entity";
import { DefectCauseEntity } from "../entities/defect-cause.entity";

export class CreateCauseDefectDto extends OmitType(DefectCauseEntity,['defect_cause_id']){
    @ApiProperty()
    defect_id: number;

    @ApiProperty()
    cause_id: number;
}