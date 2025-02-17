import { ApiProperty } from "@nestjs/swagger";

export class SearchSoluctionDto{
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}