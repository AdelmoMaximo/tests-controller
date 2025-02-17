import { Module, forwardRef } from '@nestjs/common';
import { a3_registryService } from './shared/a3_registry.service';
import { a3_registryController } from './controllers/a3_registry.controller';
import { a3_registryEntity } from './entities/a3_registry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CauseModule } from 'src/cause/cause.module';
import { SubcauseModule } from 'src/subcause/subcause.module';

@Module({
  imports: [TypeOrmModule.forFeature([a3_registryEntity]),ScheduleModule.forRoot(),forwardRef( () => CauseModule )],
  controllers: [a3_registryController],
  providers: [a3_registryService],
  exports:[a3_registryService],
})
export class RegistryModule {}
