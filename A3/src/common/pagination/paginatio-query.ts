import { ApiProperty } from "@nestjs/swagger";
import { SortDirection } from "./sort-direction.enum";


export class PaginationQuery {

    @ApiProperty({ required: true, default: 1})
    pageNumber: number;

    @ApiProperty({ required: true, default: 10})
    pageSize: number;

    @ApiProperty({ required: true, default: '_id'})
    sortCol: string;
    
    @ApiProperty({ required: true,
        enum: Object.values(SortDirection),
    }) 
    sortDir: SortDirection;

}