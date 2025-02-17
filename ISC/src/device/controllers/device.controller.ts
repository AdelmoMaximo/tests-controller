import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Patch} from '@nestjs/common';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { DeviceService } from '../shared/device.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { SearchDeviceDto } from '../dto/search-device.dto';
import { UpdateDeviceDto } from '../dto/update-device.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { PatchDeviceDto } from '../dto/patch-device.dto';


@ApiTags('Device')
@ApiBearerAuth()
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) { }


  @Get()
  @UseGuards(PermissionGuard(Permission.Device.FIND_ALL))
  async getAll(@Query() paginationFilter: FilterWorkstation, @Query() search: SearchDeviceDto) {
    return this.deviceService.getAll(paginationFilter, search);
  }
  @Get('/getOptions/')
  //@UseGuards(PermissionGuard(Permission.Device.FIND_ALL))
  async getOptions() {
    return this.deviceService.getOptions();
  }
  @Get(':id')
  @UseGuards(PermissionGuard(Permission.Device.FIND_BY_ID))
  async getById(@Param('id') id: number) {
    return this.deviceService.getByID(id);
  }

  @Get('name/:name')
  @UseGuards(PermissionGuard(Permission.Device.FIND_ALL))
  async getByName(@Param('name') name: string) {
    return this.deviceService.getByName(name)
  }

  @Post()
  @UseGuards(PermissionGuard(Permission.Device.CREATE))
  async create(@Body() deviceDto: CreateDeviceDto) {
    return this.deviceService.create(deviceDto);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(Permission.Device.UPDATE))
  async update(@Param('id') id: number, @Body() updateDto: UpdateDeviceDto) {
    return this.deviceService.update(id, updateDto);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(Permission.Device.UPDATE))
  async updateDevice(@Param('id') id:number, @Body() patch :PatchDeviceDto ){
      return this.deviceService.edit(id, patch);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.Device.REMOVE))
  async delete(@Param('id') id: number) {
    return this.deviceService.delete(id);
  }


}
