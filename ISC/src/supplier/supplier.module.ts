import { Module, forwardRef } from '@nestjs/common';
import { SupplierService } from './shared/supplier.service';
import { SupplierController } from './controllers/supplier.controller'
import { SupplierEntity } from './entities/supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelModule } from 'src/models/models.module';


@Module({
  imports: [TypeOrmModule.forFeature([SupplierEntity]), forwardRef( () =>ModelModule)],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService]
})
export class SupplierModule {}
