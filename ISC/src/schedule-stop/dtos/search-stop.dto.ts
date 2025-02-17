import { ApiProperty } from "@nestjs/swagger";

export class SearchStopDto{
    @ApiProperty({nullable:true, required:false})
    search_name: string;

    @ApiProperty({nullable:true, required:true})
    search_type: number;
}