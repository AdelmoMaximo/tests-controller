import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { SupplierService } from '../shared/supplier.service';
import { SupplierEntity } from '../entities/supplier.entity';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { SearchSupplierDto } from '../dto/search-supplier.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';

@ApiTags('Supplier')
@ApiBearerAuth()
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  @Post()
  @UseGuards(PermissionGuard(Permission.Supplier.CREATE))
  async create(@Body() supplierData: CreateSupplierDto): Promise<SupplierEntity> {
    return this.supplierService.create(supplierData);
  }

  @Get()
  @UseGuards(PermissionGuard(Permission.Supplier.FIND_ALL))
  async getAll(@Query() paginationFilter:FilterWorkstation,@Query() search:SearchSupplierDto) {
    return this.supplierService.getAll(paginationFilter,search);
  }
  @Get('/getOptions/')
  async getOptions(){
      return this.supplierService.getOptions();
  }
  @Get('name/:name')
  @UseGuards(PermissionGuard(Permission.Supplier.FIND_ALL))
  async getByName(
    @Param('name') name:string
  ){
    return this.supplierService.getByName(name)
  }
  @Get('abr/:abr')
  @UseGuards(PermissionGuard(Permission.Supplier.FIND_ALL))
  async getByAbr(
    @Param('abr') abre:string
  ){
    return this.supplierService.getByAbre(abre)
  }

  @Get('code/:code')
  @UseGuards(PermissionGuard(Permission.Supplier.FIND_ALL))
  async getByCode(
    @Param('code') code:string
  ){
    return this.supplierService.getByCode(code)
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.Supplier.FIND_BY_ID))
  async getById(@Param('id') id: number): Promise<SupplierEntity> {
    const supplier = await this.supplierService.getById(id);

    return supplier;
  }

  @Put(':id')
  @UseGuards(PermissionGuard(Permission.Supplier.UPDATE))
  async update(@Param('id') id: number, @Body() supplierData: UpdateSupplierDto): Promise<SupplierEntity> {
    return this.supplierService.update(id, supplierData);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.Supplier.REMOVE))
  async delete(@Param('id') id: number) {
    return this.supplierService.delete(id);
  }


}
