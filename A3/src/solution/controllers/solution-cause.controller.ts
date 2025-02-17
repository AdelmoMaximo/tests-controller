import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SolutionCauseService } from '../shared/solution-cause.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { CreateSolutionCauseDto } from '../dto/create-solution-cause.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { UpdateSolutionCauseDto } from '../dto/update-solution-cause.dto';

@ApiTags('Solution-Cause')
@ApiBearerAuth()
@Controller('solution-cause')
export class SolutionCausesController {
  constructor(private readonly solutionCauseService: SolutionCauseService) {}

  @Get()
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_ALL))
  async getAll() {
    return this.solutionCauseService.getAll();
  }
  @Get('/cause/:id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  async getByIdCause(@Param('id') id: number) {
    return this.solutionCauseService.getByCauseId(id);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  async getById(@Param('id') id: number) {
    return this.solutionCauseService.getById(id);
  }

  @Post()
  @UseGuards(PermissionGuard(Permission.A3Pdca.CREATE))
  async create(
      @Body() createA3_SolutionDto:CreateSolutionCauseDto
  ){
      return this.solutionCauseService.create(createA3_SolutionDto);
  }
  @Put(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.UPDATE))
  async update(@Param('id') id: number, @Body() UpdateSoluction: UpdateSolutionCauseDto) {
      return this.solutionCauseService.update(id, UpdateSoluction);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.REMOVE))
  async delete(@Param('id') id: number) {
    return this.solutionCauseService.delete(id);
  }
}
