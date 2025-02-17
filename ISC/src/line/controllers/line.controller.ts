import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Patch} from '@nestjs/common';
import { CreateLineDto } from '../dtos/create-line.dto';
import { UpdateLineDto } from '../dtos/update-line.dto';
import { LineService } from '../shared/line.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { SearchLineDto } from '../dtos/search-line.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { lineEntity } from '../entities/line.entity';
import { PatchLineDto } from '../dtos/patch-line.dto';


@ApiTags('line')
@ApiBearerAuth()
@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Get()
  @UseGuards(PermissionGuard(Permission.Line.FIND_ALL))
  async getAll(
      @Query() searchType: SearchLineDto,
      @Query() paginationFilter:FilterWorkstation
  ){
      return this.lineService.getAll(paginationFilter,searchType);
  }

  @Post()
  @UseGuards(PermissionGuard(Permission.Line.CREATE))
  async create(@Body() lineDto: CreateLineDto): Promise<lineEntity> {
    return await this.lineService.create(lineDto);
  }

  
  @Get('/getOptions/')
  async getOptions(){
      return this.lineService.getOptions();
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.Line.FIND_BY_ID))
  async getById(@Param('id') id: number) {
    return this.lineService.getById(id);
  }
  
  @Get('verifyPhase/:phase_name')
  @UseGuards(PermissionGuard(Permission.Line.FIND_ALL))
  async verifyPhase(@Param('phase_name') phase_name: string) {
    return await this.lineService.verifyPhase(phase_name);
  }

  @Get('line/:line_name')
  @UseGuards(PermissionGuard(Permission.Line.FIND_ALL))
  async getByLine(
      @Param('line_name') line_name:string
  ){
      return this.lineService.getByLine(line_name);
  }

  @Get('phase/:phase_name')
  @UseGuards(PermissionGuard(Permission.Line.FIND_ALL))
  async getByPhase(
      @Param('phase_name') phase_name:string
  ){
      return this.lineService.getByPhase(phase_name);
  }
  
  @Put(':id')
  @UseGuards(PermissionGuard(Permission.Line.UPDATE))
  async update(@Param('id') id: number, @Body() lineDto: UpdateLineDto) {
    return this.lineService.update(id, lineDto);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(Permission.Line.UPDATE))
  async updateLine(@Param('id') id:number, @Body() patch :PatchLineDto ){
      return this.lineService.edit(id, patch);
  }

}
