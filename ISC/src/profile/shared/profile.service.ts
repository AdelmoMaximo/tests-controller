import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { converteBooleanToBit } from "src/common/utils/boolean.bit";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { NameValidate } from "src/common/utils/name.validate";
import { UsersService } from "src/users/shared/users.service";
import { Repository } from "typeorm";
import { CreateProfileDto } from "../dtos/create-profile.dto";
import { SearchProfileDto } from "../dtos/search-profile.dto";
import { UpdateProfileDto } from "../dtos/update-profile.dto";
import { ProfileEntity } from "../entities/profile.entity";
import { TransactionsService } from "./transactions.service";

@Injectable()
export class ProfileService{
    constructor(
        @InjectRepository(ProfileEntity)
        private readonly profileRepository: Repository<ProfileEntity>,
        private readonly userService: UsersService,
        private readonly transactionsService:TransactionsService
    ){}
    async getById(id:number){
        return this.profileRepository.createQueryBuilder('profile')
        .leftJoinAndSelect('profile.transactions','transactions')
        .where('profile.profile_id = :id',{id})
        .getOne();
    }
    async getByName(profileName:string){
        return this.profileRepository.findOne({where:{profile_name:profileName}})
    }
    async getOptions(){
        return this.profileRepository.createQueryBuilder('profile')
        .where('profile.profile_status = 1')
        .orderBy('profile.profile_name', 'ASC')
        .getMany();

    }
    async getAll(PaginationFilter:FilterWorkstation,search:SearchProfileDto){
        const { sort } = PaginationFilter
        const { search_name,search_type } = search

        const query = this.profileRepository.createQueryBuilder('profile')

        if(search_type ==1){
            query.andWhere('profile.profile_status = 0')
        }
        else if(search_type ==2){
            query.andWhere('profile.profile_status = 1')
        }

        if(search_name){
            query.andWhere('profile.profile_name like :profileName',{profileName: `${search_name}%`})
        }

        query.orderBy('profile.profile_name',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
        return paginate<ProfileEntity>(query,PaginationFilter);
    }
    async createProfile(createDto:CreateProfileDto){
        const newProfile = this.profileRepository.create(createDto)

        newProfile.profile_status = !converteBooleanToBit(newProfile.profile_status);
        newProfile.profile_name = NameValidate.getInstance().getValidProfile(newProfile.profile_name);
        newProfile.profile_create_date = new Date ();

        const profile = await this.getByName(newProfile.profile_name)
        if(profile){
            throw new BadRequestException('Perfil com este nome já existe!')
        }
        return await this.profileRepository.save(newProfile);
    }
    async updateProfile(id:number,updateProfile:UpdateProfileDto){
        const updatedProfile = await this.getById(id)

        updatedProfile.profile_name = NameValidate.getInstance().getValidName(updateProfile.profile_name)

        const profile = await this.getByName(updatedProfile.profile_name)
        if(profile && profile.profile_id != id){
            throw new BadRequestException('Perfil com este nome já existe!')
        }
        return await this.profileRepository.save(updatedProfile);
    }
    async deleteProfile(id:number){
        const users = await this.userService.getByProfile(id);
        
        if(users){
            throw new BadRequestException('Perfil relacionado a usuário!');
        }

        await this.transactionsService.delete(id);
        const profile = await this.getById(id);
        if(!profile) throw new BadRequestException("Perfil inexiste na base de dados!")
        return this.profileRepository.remove(profile);
    }
    async changeStatus(id:number){
        const profile = await this.getById(id);
        
        profile.profile_status = !!converteBooleanToBit(profile.profile_status);

        return this.profileRepository.save(profile);
    }
}