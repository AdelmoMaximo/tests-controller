import { ApiProperty } from "@nestjs/swagger"
import { FilterPagination } from "src/common/utils/filter.pagination"

export class FilterWorkstation extends FilterPagination {
    @ApiProperty({ required: false, default: 'goal_id', enum: ['goal_id'] })
    orderBy: string
}