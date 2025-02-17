import {Body,Controller,Delete,Get,Param,Post,Put,Query,UseGuards,} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PdcaService } from '../shared/pdca.service';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { CreatePdcaDto } from '../dto/create-pdca.dto';
import { UpdatePdcaDto } from '../dto/edit-pdca.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';


@ApiTags('Pdca')
@ApiBearerAuth()
@Controller('pdca')
export class PdcaController {
  constructor(private readonly pdcaService: PdcaService) {}

  @Post()
  @UseGuards(PermissionGuard(Permission.A3Pdca.CREATE))
  async create(@Body() pdca: CreatePdcaDto) {
    return this.pdcaService.create(pdca);
  }

  @Get()
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_ALL))
  async getAll(
    @Query() paginationFilter: FilterWorkstation
  ) {
    return this.pdcaService.getAll(paginationFilter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  async getById(@Param('id') id: number) {
    return this.pdcaService.getById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.UPDATE))
  async update(@Param('id') id: number, @Body() updateDto: CreatePdcaDto) {
    return this.pdcaService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.REMOVE))
  async delete(@Param('id') id: number) {
    return this.pdcaService.delete(id);
  }
}
