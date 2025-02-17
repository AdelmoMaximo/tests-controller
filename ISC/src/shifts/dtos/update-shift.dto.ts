import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ShiftEntity } from "../entities/shift.entity";



export class UpdateShiftDto extends OmitType(ShiftEntity, ['shifts_id','shifts_status']) {
    
    @ApiProperty()
    shifts_name: string;

    @ApiProperty()
    shifts_acronym: string;

    @ApiProperty()
    shifts_update_user: string;
    
}