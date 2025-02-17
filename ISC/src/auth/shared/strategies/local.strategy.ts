import { Unauthorized } from './../../../common/exception-filters/unauthorized.exception';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { VerifyCredentials } from "src/common/utils/Enums";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super({
            usernameField:  VerifyCredentials.verifyUsername,
            passwordField:  VerifyCredentials.verifyPassword,
        });
    }

    async validate(login:string, password: string): Promise<any>{
        const user = await this.authService.validateUser(login, password);
        if (!user) {
            throw new Unauthorized('Invalid login details!');
        }

        return user;
    }
}