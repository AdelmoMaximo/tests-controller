import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { CreateSoluctionCauseDto } from "../dtos/create-cause-soluction.dto";
import { CreateCauseDto } from "../dtos/create-cause.dto";
import { CauseService } from "../shared/cause.service";
import { SoluctionCauseService } from "../shared/soluction-cause.service";
import { SearchCauseDto } from "../dtos/search-cause.dto";

@ApiTags('Cause')
@ApiBearerAuth()
@Controller('cause')
export class CauseController{
    constructor(
        private readonly causeService:CauseService
    ){}
    @Post()
    @UseGuards(PermissionGuard(Permission.Cause.CREATE))
    async create(
        @Body() causeDto:CreateCauseDto
    ){
        return this.causeService.create(causeDto);
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.Cause.FIND_ALL))
    async getSoluctions(
        @Query() paginationFilter:FilterWorkstation,
        @Query() search: SearchCauseDto
    ){
        return this.causeService.getAll(paginationFilter,search);
    }
    @Get('name/:name')
    @UseGuards(PermissionGuard(Permission.Cause.FIND_ALL))
    async getByName(
        @Param('name') name:string
    ){
        return this.causeService.getByName(name);
    }
    @Get('/getOptions/')
    async getOptions(){
        return this.causeService.getOptions();
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Cause.FIND_BY_ID))
    async getById(
        @Param('id') id:number
    ){
        return this.causeService.getById(id)
    }
    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Cause.UPDATE))
    async editSoluctions(
        @Param('id') id:number,
        @Body() causeDto:CreateCauseDto
    ){
        return this.causeService.update(id,causeDto)
    }
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Cause.REMOVE))
    async delete(
        @Param('id') id:number
    ){
       return this.causeService.delete(id);
    }
}