import { Module, forwardRef } from '@nestjs/common';
import { A3_CauseService } from './shared/a3_cause.service';
import { A3_CauseController } from './controllers/a3-cause.controller';
import { a3_causeEntity } from './entities/a3_cause.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { a3_registryService } from 'src/registry/shared/a3_registry.service';
import { a3_registryEntity } from 'src/registry/entities/a3_registry.entity';
import { RegistryModule } from 'src/registry/registry.module';
import { SubcauseModule } from 'src/subcause/subcause.module';
import { A3_SubcauseService } from 'src/subcause/shared/a3_subcause.service';
import { a3_subcauseEntity } from 'src/subcause/entities/a3_subcause.entity';



@Module({
  imports: [TypeOrmModule.forFeature([a3_causeEntity]), forwardRef(() => RegistryModule), forwardRef(() => SubcauseModule)],
  controllers: [A3_CauseController],
  providers: [A3_CauseService,A3_CauseController],
  exports:[A3_CauseService],
})
export class CauseModule {}
