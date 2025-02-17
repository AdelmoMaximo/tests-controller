import { ApiProperty } from "@nestjs/swagger";

export class SearchSupplierDto{
    @ApiProperty({nullable:true, required:false})
    search_name: string;
}