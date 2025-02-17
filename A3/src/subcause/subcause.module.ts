import { Module, forwardRef } from '@nestjs/common';
import { A3_SubcauseService } from './shared/a3_subcause.service';
import { A3_SubcauseController } from './controllers/a3-subcause.controller';
import { a3_subcauseEntity } from './entities/a3_subcause.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CauseModule } from 'src/cause/cause.module';
import { RegistryModule } from 'src/registry/registry.module';
import { a3_causeEntity } from 'src/cause/entities/a3_cause.entity';
import { a3_registryEntity } from 'src/registry/entities/a3_registry.entity';
import { A3_CauseService } from 'src/cause/shared/a3_cause.service';
import { a3_registryService } from 'src/registry/shared/a3_registry.service';


@Module({
  imports: [TypeOrmModule.forFeature([a3_subcauseEntity, a3_registryEntity]), forwardRef(() => CauseModule)],
  controllers: [A3_SubcauseController],
  providers: [A3_SubcauseService, a3_registryService],
  exports:[A3_SubcauseService, SubcauseModule]
})
export class SubcauseModule {}