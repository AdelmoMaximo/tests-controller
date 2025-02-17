import { ApiProperty } from "@nestjs/swagger";

export class SearchCauseDto{
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}