import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { lineEntity } from './entities/line.entity';
import { LineService } from './shared/line.service';
import { LineController } from './controllers/line.controller';

@Module({
  imports: [TypeOrmModule.forFeature([lineEntity])],
  providers: [LineService],
  controllers: [LineController],
  exports:[LineService, LineModule]
})
export class LineModule {}