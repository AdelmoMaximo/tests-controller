import { Body, Controller, Post, Get, Put,Query,Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { Param, Patch, UseGuards } from '@nestjs/common/decorators';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { ScheduledStopService } from '../shared/schedule-stop.service';
import { SearchStopDto } from '../dtos/search-stop.dto';
import { CreateScheduledStopDto } from '../dtos/create-stop.dto';
import { PatchStopDto } from '../dtos/patch-schedule.dto';
import { UpdateScheduledStopDto } from '../dtos/update-stop.dto';
import { FinalizeScheduledStopDto } from '../dtos/finalize-stop.dto';

@ApiTags('Scheduled-stop')
@ApiBearerAuth()
@Controller('scheduled-stop')
export class ScheduledStopController {
    constructor(
        private readonly scheduleStopService: ScheduledStopService
    ){}

    @Post()
    @UseGuards(PermissionGuard(Permission.ScheduleStop.CREATE))
    async create(@Body() shift: CreateScheduledStopDto) {
        return this.scheduleStopService.create(shift);
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.ScheduleStop.FIND_ALL))
    async getAll(
        @Query() searchType: SearchStopDto,
        @Query() paginationFilter:FilterWorkstation
    ) {
        return this.scheduleStopService.getAll(paginationFilter,searchType);
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.ScheduleStop.FIND_BY_ID))
    async getOne(@Param('id') id: number) {
        return this.scheduleStopService.getById(id);
    }

    @Put(':id')
    @UseGuards(PermissionGuard(Permission.ScheduleStop.UPDATE))
    async updateShift(@Param('id') id: number, @Body() shift:UpdateScheduledStopDto) {
        return this.scheduleStopService.edit(id, shift);
    }

    @Patch('finalize/:id')
    @UseGuards(PermissionGuard(Permission.ScheduleStop.UPDATE))
    async finalizeScheduled(@Param('id') id:number, @Query() dto :FinalizeScheduledStopDto){
        return this.scheduleStopService.finalizeId(id,dto);
    }

    @Patch(':id')
    @UseGuards(PermissionGuard(Permission.ScheduleStop.UPDATE))
    async updateScheduled(@Param('id') id:number, @Query() justify :PatchStopDto ){
        return this.scheduleStopService.suspendId(id,justify.justify);
    }

    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.ScheduleStop.REMOVE))
    async removeShift(@Param('id') id: number) {
        return this.scheduleStopService.delete(id);
    }

}
