import { ApiProperty } from "@nestjs/swagger";

export class SearchProfileDto{
    @ApiProperty({nullable:true, required:false})
    search_name: string;
    @ApiProperty({nullable:false, required:true})
    search_type: number;
}