import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { NotifyService } from '../shared/notify.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { PageRequest } from 'src/common/pagination/page-request.model';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';

@ApiTags('Notify')
@ApiBearerAuth()
@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Get()
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  findAll(
    @Query() paginationFilter: FilterWorkstation,
  ) {
    const pageRequest : PageRequest = PageRequest.from(
      paginationFilter.page,
      paginationFilter.limit,
      paginationFilter.orderBy,
      paginationFilter.sort,
    )
    return this.notifyService.findAll(pageRequest);
  }
  @Patch(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  update(@Param('id') id:number){
    return this.notifyService.updateStatus(id);
  }
}
