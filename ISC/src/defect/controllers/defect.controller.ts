import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { CreateDefectDto } from "../dtos/create-defect.dto";
import { DefectService } from "../shared/defect.service";
import { SearchDefectDto } from "../dtos/search-defect.dto";

@ApiTags('Defect')
@ApiBearerAuth()
@Controller('defect')
export class DefectController{
    constructor(
        private readonly defectService:DefectService
    ){}
    @Post()
    @UseGuards(PermissionGuard(Permission.Defect.CREATE))
    async create(
        @Body() soluctionDto: CreateDefectDto
    ){
        return this.defectService.create(soluctionDto);
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.Defect.FIND_ALL))
    async getSoluctions(
        @Query() paginationFilter:FilterWorkstation,
        @Query() search: SearchDefectDto
    ){
        return this.defectService.getAll(paginationFilter,search);
    }
    
    @Get('/getOptions/')
    async getOptions(){
        return this.defectService.getOptions();
    }

    @UseGuards(PermissionGuard(Permission.Defect.FIND_ALL))
    async getByName(
        @Param('name') name:string
    ){
        return this.defectService.getByName(name);
    }

    @Get('code/:code')
    @UseGuards(PermissionGuard(Permission.Defect.FIND_ALL))
    async getByCode(
        @Param('code') name:string
    ){
        return this.defectService.getbyCode(name);
    }

    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Defect.FIND_BY_ID))
    async getById(
        @Param('id') id:number
    ){
        return this.defectService.getById(id);
    }

    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Defect.UPDATE))
    async editSoluctions(
        @Param('id') id:number,
        @Body() defectDto:CreateDefectDto
    ){
        return this.defectService.edit(id,defectDto)
    }
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Defect.REMOVE))
    async delete(
        @Param('id') id:number
    ){
       return this.defectService.delete(id);
    }
}