import { ApiProperty, OmitType } from "@nestjs/swagger";
import { DefectEntity } from "../entities/defect.entity";
import { DefectCauseEntity } from "../entities/defect-cause.entity";

export class UpdateCauseDefectDto extends OmitType(DefectCauseEntity,['defect_cause_id','defect_id']){
    @ApiProperty()
    cause_id: number;
}