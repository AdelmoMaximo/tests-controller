import { ApiProperty } from "@nestjs/swagger";

export class SearchA3_SubcauseDto {

    @ApiProperty({nullable:true, required:false})
    order_type:number;
    
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}

