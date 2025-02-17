import { UpdateShiftDto } from './../dtos/update-shift.dto';
import { CreateShiftDto } from './../dtos/create-shift.dto';
import { Body, Controller, Post, Get, Put,Query,Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { ShiftsService } from '../shared/shifts.service';
import { Param, UseGuards } from '@nestjs/common/decorators';
import { SearchShiftDto } from '../dtos/search-shift.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';

@ApiTags('Shift')
@ApiBearerAuth()
@Controller('shifts')
export class ShiftsController {
    constructor(
        private readonly shiftService:  ShiftsService
    ){}

    @Post()
    @UseGuards(PermissionGuard(Permission.Shift.CREATE))
    async create(@Body() shift: CreateShiftDto) {
        return this.shiftService.create(shift);
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.Shift.FIND_ALL))
    async getAll(
        @Query() searchType: SearchShiftDto,
        @Query() paginationFilter:FilterWorkstation
    ) {
        return this.shiftService.getAll(searchType,paginationFilter);
    }
    @Get('/getOptions/')
    //@UseGuards(PermissionGuard(Permission.Shift.FIND_ALL))
    async getOptions(){
        return this.shiftService.getOptions();
    }
    @Get('/getOptions/:id')
    async getDays(@Param('id') id:number){
        return this.shiftService.getDays(id);
    }
    @Get("/acronym/:acronym")
    @UseGuards(PermissionGuard(Permission.Shift.FIND_ALL))
    async getByAcronym(@Param('acronym') acronym: string) {
        return this.shiftService.getByAcronym(acronym);
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Shift.FIND_BY_ID))
    async getOne(@Param('id') id: number) {
        return this.shiftService.returnById(id);
    }

    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Shift.UPDATE))
    async updateShift(@Param('id') id: number, @Body() shift:UpdateShiftDto) {
        return this.shiftService.update(id, shift);
    }

    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Shift.REMOVE))
    async removeShift(@Param('id') id: number) {
        return this.shiftService.remove(id);
    }

}
