import { Controller, Get, Param, Post, Body, Put, Delete, Query, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { A3_CauseService} from '../shared/a3_cause.service';
import { CreateA3_CauseDto } from '../dto/create-cause.dto';
import { UpdateA3_CauseDto } from '../dto/update-cause.dto';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { SearchA3_CauseDto } from '../dto/search-cause.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';

@ApiTags('A3_Cause')
@ApiBearerAuth()
@Controller('A3-cause')
export class A3_CauseController {
  constructor(private readonly A3_CauseService: A3_CauseService) {}

  @Get('/getoptions/:id')
  async getCausesByRegistry(
    @Param('id') id: number
  ){
    return this.A3_CauseService.getRegistryCause(id);
  }

  @Get()
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_ALL))
  async getAll(
    @Query() paginationFilter: FilterWorkstation,
    @Query() search: SearchA3_CauseDto,
  ) {
    return this.A3_CauseService.getAll(paginationFilter, search);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  async getById(@Param('id') id: number) {
    return this.A3_CauseService.getById(id);
  }
  @Post()
  @UseGuards(PermissionGuard(Permission.A3Pdca.CREATE))
  async create(
      @Body() createA3_CauseDto:CreateA3_CauseDto
  ){
      return this.A3_CauseService.create(createA3_CauseDto);
  }
  @Put(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.UPDATE))
  async update(@Param('id') id: number, @Body() updateCause: UpdateA3_CauseDto) {
      return this.A3_CauseService.update(id, updateCause);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.REMOVE))
  async delete(@Param('id') id: number) {
    return this.A3_CauseService.delete(id);
  }


}