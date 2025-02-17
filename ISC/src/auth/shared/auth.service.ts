import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Unauthorized } from 'src/common/exception-filters/unauthorized.exception';
import { hash, isMatchHash } from 'src/common/utils/hash';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/shared/users.service';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService:ConfigService,
        private readonly userService:UsersService
    ){}
    async getTokens(sub: number, enrollment?: string, name?: string, transactions?:number[], has_private_permission?: boolean){
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync({
                sub: sub,
                enrollment: enrollment,
                name: name,
                transactions: transactions
            },
            {
                secret: this.configService.get('auth.token_secret'),
                expiresIn: this.configService.get('auth.token_expires_in'),
                algorithm: 'HS256'
                
            }),
            this.jwtService.signAsync({
                sub:sub,
                enrollment: enrollment,
                has_private_permission: has_private_permission
            },
            {
                secret: this.configService.get('auth.refresh_token_secret'),
                expiresIn: this.configService.get('auth.refresh_token_expires_in'),
                algorithm: 'HS256'
            })
        ]);
        return {
            access_token:access_token,
            refresh_token:refresh_token
        }
    }
    async generateToken(has_private_permission:boolean, auth:LoginDto){
        const user = await this.userService.getByLogin(auth.login);

        const transactions = await this.getTransacttions(user);

        const {access_token, refresh_token} = await this.getTokens(user.users_id,user.profile.profile_name,user.users_name,transactions,has_private_permission);

        const hashed_refresh_token = await hash(refresh_token);

        await this.userService.updateRefreshToken(user.users_id,hashed_refresh_token);

        return{
            access_token: access_token,
            refresh_token: refresh_token,
            expires_in: this.configService.get('auth.token_expires_in'),
            name: user.users_name,
            email: user.users_email,
        }

    }
    async getTransacttions(user:UserEntity){
        const transactions: number[] = [];

        user.profile.transactions.forEach( transaction =>{
            transactions.push(transaction.transactions_cod);
        });
        
        return transactions;
    }
    async validateUser(login:string,password:string){
    
        const user = await this.userService.getByLogin(login);
       
        if(!user){
            throw new Unauthorized('Invalid login details!')
        }

        if(!user.users_status){
            throw new Unauthorized('Inactive user, contact the system administrator')
        }
        if(user.count_tries===0){
            throw new Unauthorized('Exceeded access attempts. Blocked account. Contact admin.')
        }
        if(user.users_delete){
            throw new Unauthorized('Excluded User!')
        }
        if(login === user.users_login && password){
            const hashPassword = await isMatchHash(password,user.users_password);
            if(user && hashPassword){
                await this.userService.unlock(user.users_id);
                return{
                    user:user,
                    has_private_permission:true
                }
            }
            else{
                await this.userService.decreaseTries(user.users_id);
                throw new Unauthorized('Invalid login details! '+ (user.count_tries-1) +' tries left.');
            }
        }
        else{
            return null;
        }
    }
    async refreshToken(has_private_permission:boolean,sub:number,old_refresh_Token:string){
        const user = await this.userService.getById(sub);
        if(!user){
            throw new HttpException('Usuário inválido!',HttpStatus.NOT_FOUND)
        }
        if(!user.users_token) {
            throw new HttpException('Refresh token inexistente neste usuário', HttpStatus.NOT_FOUND);
        }

        const verifyHash = await isMatchHash(old_refresh_Token,user.users_token);

        if(!verifyHash){
            throw new HttpException('Refresh token inválido!', HttpStatus.NOT_FOUND);
        }
        const transactions = await this.getTransacttions(user);

        const {access_token, refresh_token} = await this.getTokens(user.users_id,user.profile.profile_name,user.users_name,transactions,has_private_permission);

        const hashed_refresh_token = await hash(refresh_token);

        await this.userService.updateRefreshToken(user.users_id,hashed_refresh_token);

        return{
            access_token: access_token,
            refresh_token: refresh_token,
            expires_in: this.configService.get('auth.token_expires_in'),
            name: user.users_name,
            email: user.users_email,
        }
    }
    async removeRefreshToken(id:number){
        const user = await this.userService.getById(id);

        if(!user){
            throw new HttpException('Usuário inválido!',HttpStatus.NOT_FOUND)
        }

        await this.userService.updateRefreshToken(user.users_id,null);
    }
}
