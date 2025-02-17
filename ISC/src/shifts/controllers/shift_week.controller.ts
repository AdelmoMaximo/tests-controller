import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { PublicRoute } from "src/common/decorators/public-route.decorator";
import { UpdateShiftWeekDto } from "../dtos/update-shift_week.dto";
import { CreateShiftWeekDto } from "./../dtos/create-shift_week.dto";
import { ShiftWeekService } from "./../shared/shift_week.service";

@ApiTags('ShiftWeek')
@ApiBearerAuth()
@Controller('shift_week')
export class ShiftWeekController {
    constructor(
        private readonly shiftWeekService: ShiftWeekService
    ) { }
    @Post()
    @UseGuards(PermissionGuard(Permission.Shift.CREATE))
    async createShiftWeek(
        @Body() shiftWeekDto: CreateShiftWeekDto
    ) {
        return this.shiftWeekService.createShiftWeek(shiftWeekDto);
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Shift.FIND_BY_ID))
    async getOne(
        @Param('id') id: number
    ) {
        return this.shiftWeekService.getById(id);
    }
    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Shift.UPDATE))
    async update(
        @Param('id') id: number,
        @Body() updateDay: UpdateShiftWeekDto
    ){
        return this.shiftWeekService.update(id,updateDay);
    }
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Shift.REMOVE))
    async delete(
        @Param('id') id:number
    ){
        return this.shiftWeekService.remove(id);
    }
}
