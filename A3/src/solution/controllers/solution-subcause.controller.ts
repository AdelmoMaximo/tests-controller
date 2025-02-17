import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SolutionSubcauseService } from '../shared/solution-subcause.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { CreateSolutionSubcauseDto } from '../dto/create-solution-subcause.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { UpdateSolutionSubcauseDto } from '../dto/update-solution-subcause.dto';

@ApiTags('Solution-Subcause')
@ApiBearerAuth()
@Controller('solution-subcause')
export class SolutionSubcauseController {
  constructor(private readonly solutionSubcauseService: SolutionSubcauseService) {}

  @Get()
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_ALL))
  async getAll() {
    return this.solutionSubcauseService.getAll();
  }

  @Get('/subcause/:id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  async getByIdCause(@Param('id') id: number) {
    return this.solutionSubcauseService.getByCauseId(id);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.FIND_BY_ID))
  async getById(@Param('id') id: number) {
    return this.solutionSubcauseService.getById(id);
  }

  @Post()
  @UseGuards(PermissionGuard(Permission.A3Pdca.CREATE))
  async create(
      @Body() createA3_SolutionDto:CreateSolutionSubcauseDto
  ){
      return this.solutionSubcauseService.create(createA3_SolutionDto);
  }
  @Put(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.UPDATE))
  async update(@Param('id') id: number, @Body() UpdateSubSolution: UpdateSolutionSubcauseDto) {
      return this.solutionSubcauseService.update(id, UpdateSubSolution);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.A3Pdca.REMOVE))
  async delete(@Param('id') id: number) {
    return this.solutionSubcauseService.delete(id);
  }
}
