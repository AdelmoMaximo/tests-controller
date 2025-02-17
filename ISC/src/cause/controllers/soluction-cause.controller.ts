import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { CreateSoluctionCauseDto } from "../dtos/create-cause-soluction.dto";
import { UpdateSoluctionCauseDto } from "../dtos/edit-cause-soluction.dto";
import { SoluctionCauseService } from "../shared/soluction-cause.service";

@ApiTags('Soluction-Cause')
@ApiBearerAuth()
@Controller('soluctionCause')
export class SoluctionCauseController{
    constructor(
        private readonly soluctionService:SoluctionCauseService
    ){}
    @Post()
    @UseGuards(PermissionGuard(Permission.Cause.CREATE))
    async create(
        @Body() soluctionDto:CreateSoluctionCauseDto
    ){
        return this.soluctionService.create(soluctionDto);
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.Cause.FIND_ALL))
    async getSoluctions(
        @Query() paginationFilter:FilterWorkstation
    ){
        return this.soluctionService.getAll();
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Cause.FIND_ALL))
    async getById(
        @Param('id') id:number
    ){
        return this.soluctionService.getById(id);
    }
    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Cause.UPDATE))
    async editSoluctions(
        @Param('id') id:number,
        @Body() causeDto:UpdateSoluctionCauseDto
    ){
        return this.soluctionService.update(id,causeDto)
    }
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Cause.FIND_ALL))
    async delete(
        @Param('id') id:number
    ){
       return this.soluctionService.delete(id);
    }
}