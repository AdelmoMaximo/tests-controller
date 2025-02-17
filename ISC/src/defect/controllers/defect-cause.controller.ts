import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { DefectCauseService } from "../shared/defect-cause.service";
import { CreateCauseDefectDto } from "../dtos/create-causedefect.dto";
import { UpdateCauseDefectDto } from "../dtos/update-causedefect.dto";

@ApiTags('Defect-Cause')
@ApiBearerAuth()
@Controller('defectCause')
export class DefectCauseController{
    constructor(
        private readonly defectCauseService:DefectCauseService
    ){}
    @Post()
    @UseGuards(PermissionGuard(Permission.Defect.CREATE))
    async create(
        @Body() soluctionDto:CreateCauseDefectDto
    ){
        return this.defectCauseService.create(soluctionDto);
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.Defect.FIND_ALL))
    async getSoluctions(
        @Query() paginationFilter:FilterWorkstation
    ){
        return this.defectCauseService.getAll();
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Defect.FIND_ALL))
    async getById(
        @Param('id') id:number
    ){
        return this.defectCauseService.getById(id);
    }
    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Defect.UPDATE))
    async editSoluctions(
        @Param('id') id:number,
        @Body() defectDto:UpdateCauseDefectDto
    ){
        return this.defectCauseService.update(id,defectDto)
    }
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Defect.FIND_ALL))
    async delete(
        @Param('id') id:number
    ){
       return this.defectCauseService.delete(id);
    }
}