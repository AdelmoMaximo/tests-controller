import { Injectable, Request } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('auth.refresh_token_secret'),
            passReqToCallback: true
        });
    }

    async validate(@Request() request: Request, payload: any): Promise<any> {
        const refresh_token = request.headers['authorization'].replace('Bearer', '').trim();
        return {
            sub: payload.sub,
            refresh_token: refresh_token,
            has_private_permission: payload.has_private_permission
        };
    }
 }