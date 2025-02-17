import { ApiProperty, OmitType } from "@nestjs/swagger";
import { DefectEntity } from "../entities/defect.entity";

export class CreateDefectDto extends OmitType(DefectEntity,['defect_id']){
    @ApiProperty()
    defect_description: string;
    @ApiProperty()
    defect_code: string;
}