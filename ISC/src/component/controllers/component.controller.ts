import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { ComponentService } from "../shared/component.service";
import { CreateComponentDto } from "../dtos/create-component.dto";
import { SearchComponentDto } from "../dtos/search-component.dto";

@ApiTags('Component')
@ApiBearerAuth()
@Controller('component')
export class ComponentController{
    constructor(
        private readonly componentService:ComponentService
    ){}
    @Post()
    @UseGuards(PermissionGuard(Permission.Component.CREATE))
    async create(
        @Body() soluctionDto: CreateComponentDto
    ){
        return this.componentService.create(soluctionDto);
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.Component.FIND_ALL))
    async getSoluctions(
        @Query() paginationFilter:FilterWorkstation,
        @Query() search: SearchComponentDto
    ){
        return this.componentService.getAll(paginationFilter,search);
    }@Get('/getOptions/')
    async getOptions(){
        return this.componentService.getOptions();
    }
    @Get('name/:name')
    @UseGuards(PermissionGuard(Permission.Component.FIND_ALL))
    async getByName(
        @Param('name') name:string
    ){
        return this.componentService.getByName(name);
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Component.FIND_BY_ID))
    async getById(
        @Param('id') id:number
    ){
        return this.componentService.getById(id);
    }

    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Component.UPDATE))
    async editSoluctions(
        @Param('id') id:number,
        @Body() updateDto:CreateComponentDto
    ){
        return this.componentService.edit(id,updateDto)
    }
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Component.REMOVE))
    async delete(
        @Param('id') id:number
    ){
       return this.componentService.delete(id);
    }
}