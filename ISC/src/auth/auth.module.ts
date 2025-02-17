import { Module } from '@nestjs/common';
import { AuthService } from './shared/auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { LocalStrategy } from './shared/strategies/local.strategy';
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './shared/strategies/jwt-refresh.strategy';
import { JwtForgotPasswordStrategy } from './shared/strategies/jwt-forgot-password.strategy';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports:[
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtForgotPasswordStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
