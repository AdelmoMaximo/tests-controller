import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ShiftEntity } from "../entities/shift.entity";

export class CreateShiftDto extends OmitType(ShiftEntity, ['shifts_id']) {
    
    @ApiProperty()
    shifts_name: string;

    @ApiProperty()
    shifts_acronym: string;
    
    @ApiProperty()
    shifts_status: boolean;

    @ApiProperty()
    shifts_creator: string;
}