import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { CreateSoluctionDto } from "../dtos/create-soluction.dto";
import { SoluctionService } from "../shared/soluction.service";
import { SearchSoluctionDto } from "../dtos/search-soluction.dto";
import { ArraySoluctionDto } from "../dtos/array-soluction.dto";

@ApiTags('Soluction')
@ApiBearerAuth()
@Controller('soluction')
export class SoluctionController{
    constructor(
        private readonly soluctionService:SoluctionService
    ){}
    @Post('teste/')
    @UseGuards(PermissionGuard(Permission.Solution.CREATE))
    async testes(
        @Body() soluctionDto:ArraySoluctionDto
    ){
       console.log(soluctionDto.soluctions[0])
    }
    @Post()
    @UseGuards(PermissionGuard(Permission.Solution.CREATE))
    async create(
        @Body() soluctionDto:CreateSoluctionDto
    ){
        return this.soluctionService.createSoluction(soluctionDto);
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.Solution.FIND_ALL))
    async getSoluctions(
        @Query() paginationFilter:FilterWorkstation,
        @Query() search:SearchSoluctionDto
    ){
        return this.soluctionService.getSoluctions(paginationFilter,search);
    }
    @Get('name/:name')
    @UseGuards(PermissionGuard(Permission.Solution.FIND_ALL))
    async getByName(
        @Param('name') name:string
    ){
        return this.soluctionService.getByName(name);
    }
    @Get('/getOptions/')
    async getOptions(){
        return this.soluctionService.getOptions();
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Solution.FIND_BY_ID))
    async getById(
        @Param('id') id:number
    ){
        return this.soluctionService.getById(id);
    }
    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Solution.UPDATE))
    async editSoluctions(
        @Param('id') id:number,
        @Body() soluctionDto:CreateSoluctionDto
    ){
        return this.soluctionService.edit(id,soluctionDto)
    }
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Solution.REMOVE))
    async delete(
        @Param('id') id:number
    ){
        return this.soluctionService.delete(id);
    }
}