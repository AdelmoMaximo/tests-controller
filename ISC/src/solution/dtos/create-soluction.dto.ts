import { ApiProperty, OmitType } from "@nestjs/swagger";
import { SoluctionEntity } from "../entities/soluction.entity";


export class CreateSoluctionDto extends OmitType(SoluctionEntity,['soluction_id','soluction_created_at']){
    @ApiProperty()
    soluction_description: string;
}