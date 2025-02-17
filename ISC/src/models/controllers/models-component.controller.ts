import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { ModelsComponentService } from "../shared/models-component.service";
import { CreateModelsComponentDto } from "../dtos/create-models-component.dto";
import { UpdateModelsComponentDto } from "../dtos/update-models-component.dto";

@ApiTags('Models-Component')
@ApiBearerAuth()
@Controller('modelsComponent')
export class ModelComponentController{
    constructor(
        private readonly modelsComponent:ModelsComponentService
    ){}
    @Post()
    @UseGuards(PermissionGuard(Permission.Product.CREATE))
    async create(
        @Body() soluctionDto:CreateModelsComponentDto
    ){
        return this.modelsComponent.create(soluctionDto);
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.Product.FIND_ALL))
    async getSoluctions(
        @Query() paginationFilter:FilterWorkstation
    ){
        return this.modelsComponent.getAll();
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Product.FIND_ALL))
    async getById(
        @Param('id') id:number
    ){
        return this.modelsComponent.getById(id);
    }
    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Product.UPDATE))
    async editSoluctions(
        @Param('id') id:number,
        @Body() defectDto:UpdateModelsComponentDto
    ){
        return this.modelsComponent.update(id,defectDto)
    }
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Product.FIND_ALL))
    async delete(
        @Param('id') id:number
    ){
       return this.modelsComponent.delete(id);
    }
}