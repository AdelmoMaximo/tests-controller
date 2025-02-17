import { ApiProperty, OmitType } from "@nestjs/swagger";
import { SoluctionCauseEntity } from "../entities/soluction-cause.entity";

export class CreateSoluctionCauseDto extends OmitType(SoluctionCauseEntity,['soluction_cause_id']){
    @ApiProperty()
    soluction_id: number;
    
    @ApiProperty()
    cause_id: number;
}