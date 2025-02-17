import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CauseEntity } from "../entities/cause.entity";

export class CreateCauseDto extends OmitType(CauseEntity,['cause_created_at']){
    @ApiProperty()
    cause_description: string;
    
}