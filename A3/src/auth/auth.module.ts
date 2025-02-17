import { Module } from "@nestjs/common";
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from "src/pdca/shared/user.service";
import { PdcaModule } from "src/pdca/pdca.module";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
          }),
          PdcaModule
    ],
    providers: [
        JwtStrategy,
    ],
})
export class AuthModule {}
