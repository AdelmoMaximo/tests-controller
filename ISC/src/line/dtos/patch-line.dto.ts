import { ApiProperty, OmitType } from "@nestjs/swagger";
import { lineEntity } from "../entities/line.entity";

export class PatchLineDto extends OmitType(lineEntity,['registration_line_id','line_create_date','line_create_user','line_update_date','line_update_user','line_name','phase_name','phase_line']) {
    @ApiProperty()
    status_line: boolean;
}