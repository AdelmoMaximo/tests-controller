import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PdcaA3Service } from '../shared/pdcaA3.service';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { CreatePdcaA3Dto } from '../dto/create-pdcaA3.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { QueryPdcaDto } from '../dto/query-pdca.dto';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { PageRequest } from 'src/common/pagination/page-request.model';
import { UpdatePdcaA3Dto } from '../dto/update-pdcaA3.dto';

@ApiTags('PdcaA3')
@ApiBearerAuth()
@Controller('pdcaa3')
export class PdcaA3Controller {
  constructor(private readonly pdcaA3Service: PdcaA3Service) {}

  @Post()
  @UseGuards(PermissionGuard(Permission.A3Pdca.CREATE))
  async create(@Body() pdca: CreatePdcaA3Dto) {
    return this.pdcaA3Service.create(pdca);
  }

  @Get()
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_ALL))
  async getAll(
    @Query() paginationFilter: FilterWorkstation,
    @Query() search: QueryPdcaDto,
  ) {
    const pageRequest : PageRequest = PageRequest.from(
      paginationFilter.page,
      paginationFilter.limit,
      paginationFilter.orderBy,
      paginationFilter.sort,
    )
    return this.pdcaA3Service.getAll(paginationFilter, search, pageRequest);
  }
  @Get(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  async getById(@Param('id') id: number) {
    return this.pdcaA3Service.getById(id);
  }
  @Patch(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.UPDATE))
  async finish(@Param('id') id: number) {
    return this.pdcaA3Service.finish(id);
  }
  @Put(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.UPDATE))
  async canceled(@Param('id') id: number, @Body() UpdatePdcaA3Dto: UpdatePdcaA3Dto) {
    return this.pdcaA3Service.canceled(id, UpdatePdcaA3Dto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.REMOVE))
  async delete(@Param('id') id: number) {
    return this.pdcaA3Service.delete(id);
  }

}
