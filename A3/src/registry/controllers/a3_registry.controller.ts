import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { a3_registryService } from '../shared/a3_registry.service';
import { CreateA3_RegistryDto } from '../dto/create-registry.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { SearchRegistryDto } from '../dto/search-registry.dto';
import { UpdateA3_RegistryDto } from '../dto/update-registry.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';

@ApiTags('A3_Registry')
@ApiBearerAuth()
@Controller('A3_registry')
export class a3_registryController {
  constructor(private readonly a3_registryService: a3_registryService) {}

  @Get()
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_ALL))
  async getAll(
    @Query() paginationFilter: FilterWorkstation,
    @Query() search: SearchRegistryDto,
  ) {
    return this.a3_registryService.getAll(paginationFilter, search);
  }

  @Get('/getoptions/')
  async getOptions(){
    return this.a3_registryService.getoptions();
  }

  @Get('/getOptions2/:name')
  async getOptions2(@Param('name') name:string){
    return this.a3_registryService.getOptions2(name);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  async getById(@Param('id') id: number) {
    return this.a3_registryService.getById(id);
  }

  @Post()
  @UseGuards(PermissionGuard(Permission.A3Pdca.CREATE))
  async create(@Body() registry: CreateA3_RegistryDto) {
    return this.a3_registryService.create(registry);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.UPDATE))
  async update(@Param('id') id: number, @Body() updateRegistry: UpdateA3_RegistryDto) {
    return this.a3_registryService.update(id, updateRegistry);
  }


  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.REMOVE))
  async delete(@Param('id') id: number) {
    return this.a3_registryService.delete(id);
  }
}
