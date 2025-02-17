import { ApiProperty, OmitType } from "@nestjs/swagger";
import { SoluctionCauseEntity } from "../entities/soluction-cause.entity";

export class UpdateSoluctionCauseDto extends OmitType(SoluctionCauseEntity,['soluction_cause_id','cause_id']){
    @ApiProperty()
    soluction_id: number;
    
}