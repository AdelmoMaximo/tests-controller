import { Body, Controller, Post, Get, Put,Query,Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';;
import { Param, UseGuards } from '@nestjs/common/decorators';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { NoScheduledStopService } from '../shared/no-scheduled-stop.service';
import { CreateNoScheduledStopDto } from '../dtos/create-no-scheduled.dto';
import { SearchNoScheduledDto } from '../dtos/search-no-scheduled.dto';

@ApiTags('No-Scheduled-stop')
@ApiBearerAuth()
@Controller('no-scheduled-stop')
export class NoScheduledStopController {
    constructor(
        private readonly noScheduleStopService: NoScheduledStopService
    ){}

    @Get()
    @UseGuards(PermissionGuard(Permission.NoScheduledStop.FIND_ALL))
    async getAll(
        @Query() searchType: SearchNoScheduledDto,
        @Query() paginationFilter:FilterWorkstation
    ) {
        return this.noScheduleStopService.getAll(paginationFilter,searchType);
    }

    @Post()
    @UseGuards(PermissionGuard(Permission.NoScheduledStop.CREATE))
    async create(@Body() shift: CreateNoScheduledStopDto) {
        return this.noScheduleStopService.create(shift);
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.NoScheduledStop.FIND_BY_ID))
    async getOne(@Param('id') id: number) {
        return this.noScheduleStopService.getById(id);
    }

    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.NoScheduledStop.REMOVE))
    async removeShift(@Param('id') id: number) {
        return this.noScheduleStopService.delete(id);
    }

}
