import { ApiProperty } from "@nestjs/swagger";

export class SearchDto{
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}