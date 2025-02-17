import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../shared/auth.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../shared/guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from '../shared/guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService
    ){}
    @Post('/login')
    @PublicRoute()
    @UseGuards(LocalAuthGuard)
    async login(@Request() request:any, @Body() auth:LoginDto){
        return this.authService.generateToken(request?.user?.has_private_permission,auth);
    }
    @Post('/logout')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async logout(@Request() payload: any){
        return this.authService.removeRefreshToken(payload.user.sub)
    }
    @Post('/refresh_token')
    @ApiBearerAuth()
    @PublicRoute()
    @UseGuards(JwtRefreshAuthGuard)
    async refreshToken(@Request() payload: any) {
        return this.authService.refreshToken(payload?.user?.has_private_permission, payload.user.sub, payload.user.refresh_token);
    }
}
