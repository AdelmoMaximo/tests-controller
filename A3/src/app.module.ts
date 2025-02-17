import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { AuthModule } from './auth/auth.module';
import { SwaggerModule } from './config/swagger/swagger.module';
import { ConfigModule } from './config/environments/config.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/shared/guards/jwt-auth.guard';
import { SolutionModule } from './solution/solution.module';
import { RegistryModule } from './registry/registry.module';
import { CauseModule } from './cause/cause.module';
import { SubcauseModule } from './subcause/subcause.module';
import { PdcaModule } from './pdca/pdca.module';
import { NotifyModule } from './notify/notify.module';


@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    SwaggerModule,
    SolutionModule,
    RegistryModule,
    CauseModule,
    SubcauseModule,
    PdcaModule,
    NotifyModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService],
})
export class AppModule {}
