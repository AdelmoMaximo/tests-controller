import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { Unauthorized } from "src/common/exception-filters/unauthorized.exception";

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
    ){}
    async getById(id:number){
        return this.userRepo.createQueryBuilder('user')
        .where('user.users_id = :id',{id})
        .getOne();
      }

    async verifyLogin(id:number){
        console.log(id);
        const user = await this.getById(id);
        if(user.users_is_on===false) throw new Unauthorized('Usuário já deslogado do sistema!');
        return user.users_is_on;
    }
}