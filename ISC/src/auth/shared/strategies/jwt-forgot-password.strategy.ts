import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserEntity } from "src/users/entities/user.entity";

@Injectable()
export class JwtForgotPasswordStrategy extends PassportStrategy(Strategy, 'jwt-forgot-password') {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('auth.forgot_password_token_secret')
        });
    }

    async validate(payload: any): Promise<UserEntity> {
        return payload;
    }
 }