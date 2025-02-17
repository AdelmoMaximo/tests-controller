import { ApiProperty, OmitType } from "@nestjs/swagger";
import { SoluctionEntity } from "../entities/soluction.entity";
import { CreateSoluctionDto } from "./create-soluction.dto";


export class ArraySoluctionDto{
    @ApiProperty()
    soluctions: [CreateSoluctionDto]
}