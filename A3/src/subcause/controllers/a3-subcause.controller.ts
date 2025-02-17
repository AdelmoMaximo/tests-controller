import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { A3_SubcauseService} from '../shared/a3_subcause.service';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { SearchA3_SubcauseDto } from '../dto/search-subxause.dto';
import { CreateA3_SubcauseDto } from '../dto/create-subcause.dto';
import { UpdateA3_SubcauseDto } from '../dto/update-subcause.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';

@ApiTags('A3_Subcause')
@ApiBearerAuth()
@Controller('A3-subcause')
export class A3_SubcauseController {
  constructor(private readonly A3_SubcauseService: A3_SubcauseService) {}

  @Get()
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_ALL))
  async getAll(
    @Query() paginationFilter: FilterWorkstation,
    @Query() search: SearchA3_SubcauseDto,
  ) {
    return this.A3_SubcauseService.getAll(paginationFilter, search);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  async getById(@Param('id') id: number) {
    return this.A3_SubcauseService.getById(id);
  }
  @Post()
  @UseGuards(PermissionGuard(Permission.A3Pdca.CREATE))
  async create(
      @Body() createA3_SubcauseDto:CreateA3_SubcauseDto
  ){
      return this.A3_SubcauseService.create(createA3_SubcauseDto);
  }
  @Put(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.UPDATE))
  async update(@Param('id') id: number, @Body() updateSubcause: UpdateA3_SubcauseDto) {
      return this.A3_SubcauseService.update(id, updateSubcause);
  }
  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.REMOVE))
  async delete(@Param('id') id: number) {
    return this.A3_SubcauseService.delete(id);
  }
}