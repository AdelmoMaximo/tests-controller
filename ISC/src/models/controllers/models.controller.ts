import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ModelService } from "../shared/models.service";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import Permission from "src/auth/enums/permission.type";
import { CreateModelsDto } from "../dtos/create-models.dto";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { SearchDto } from "src/common/utils/search.dto";
import { UpdateModelsDto } from "../dtos/update-models.dto";

@ApiTags('Models')
@ApiBearerAuth()
@Controller('models')
export class ModelController{
    constructor(
        private readonly modelService: ModelService
    ){}
    @Post()
    @UseGuards(PermissionGuard(Permission.Product.CREATE))
    async create(
        @Body() modelDto: CreateModelsDto
    ){
        return this.modelService.create(modelDto);
    }
    @Get('/getOptions/')
    async getOptions(){
        return this.modelService.getOptions();
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.Product.FIND_ALL))
    async getAll(
        @Query() paginationFilter:FilterWorkstation,
        @Query() search: SearchDto
    ){
        return this.modelService.getAll(paginationFilter,search);
    }

    @Get('name/:name')
    @UseGuards(PermissionGuard(Permission.Product.FIND_ALL))
    async getByName(
        @Param('name') name:string
    ){
        return this.modelService.getByName(name);
    }

    @Get('identity/:identity')
    @UseGuards(PermissionGuard(Permission.Product.FIND_ALL))
    async getByIdentity(
        @Param('identity') identity:string
    ){
        return this.modelService.getByIdentity(identity);
    }
    
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Product.FIND_BY_ID))
    async getById(
        @Param('id') id:number
    ){
        return this.modelService.getById(id);
    }
    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Product.UPDATE))
    async editSoluctions(
        @Param('id') id:number,
        @Body() updateDto:UpdateModelsDto
    ){
        return this.modelService.update(id,updateDto);
    }
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Product.REMOVE))
    async delete(
        @Param('id') id:number
    ){
       return this.modelService.delete(id);
    }
}