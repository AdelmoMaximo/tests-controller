import { Module } from '@nestjs/common';
import { SolutionCauseService } from './shared/solution-cause.service';
import { SolutionCausesController } from './controllers/solution-cause.controller';
import { SolutionCauseEntity } from './entities/solution-cause.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolutionSubcauseEntity } from './entities/solution-subcause.entity';
import { SolutionSubcauseController } from './controllers/solution-subcause.controller';
import { SolutionSubcauseService } from './shared/solution-subcause.service';
import { a3_registryEntity } from 'src/registry/entities/a3_registry.entity';
import { RegistryModule } from 'src/registry/registry.module';
import { CauseModule } from 'src/cause/cause.module';
import { a3_causeEntity } from 'src/cause/entities/a3_cause.entity';
import { a3_registryService } from 'src/registry/shared/a3_registry.service';
import { A3_CauseService } from 'src/cause/shared/a3_cause.service';
import { A3_SubcauseService } from 'src/subcause/shared/a3_subcause.service';
import { a3_subcauseEntity } from 'src/subcause/entities/a3_subcause.entity';


@Module({
  imports: [TypeOrmModule.forFeature([SolutionCauseEntity, SolutionSubcauseEntity, RegistryModule, a3_registryEntity, CauseModule, a3_causeEntity, a3_subcauseEntity, ])],
  controllers: [SolutionCausesController, SolutionSubcauseController],
  providers: [SolutionCauseService, SolutionSubcauseService, a3_registryService, A3_CauseService, A3_SubcauseService],
  exports:[SolutionCauseService, SolutionSubcauseService]
})
export class SolutionModule {}
