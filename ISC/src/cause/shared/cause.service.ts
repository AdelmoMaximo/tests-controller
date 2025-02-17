import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { Repository } from "typeorm";
import { CreateCauseDto } from "../dtos/create-cause.dto";
import { CauseEntity } from "../entities/cause.entity";
import { SoluctionCauseEntity } from "../entities/soluction-cause.entity";
import { NameValidate } from "src/common/utils/name.validate";
import { SearchCauseDto } from "../dtos/search-cause.dto";
import { DefectCauseService } from "src/defect/shared/defect-cause.service";
import { SoluctionCauseService } from "./soluction-cause.service";


@Injectable()
export class CauseService{
    constructor(
        @InjectRepository(CauseEntity)
        private readonly causeRepository: Repository<CauseEntity>,
        private readonly soluctionCauseService: SoluctionCauseService,
        private readonly defectService:DefectCauseService
    ){}
    async getAll(PaginationFilter:FilterWorkstation,search:SearchCauseDto){
        const { sort } = PaginationFilter
        const {search_name} = search

        const query = this.causeRepository.createQueryBuilder('cause')
        if(search_name){
            query.andWhere('cause.cause_description like :profileName',{profileName: `${search_name}%`})
        }

        query.orderBy('cause.cause_description',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
        return paginate<CauseEntity>(query,PaginationFilter);
    }
    async create(createDto:CreateCauseDto){
        const cause_name = await this.getByName(createDto.cause_description)

        if(cause_name) throw new BadRequestException("Causa ja cadastrada!")

        const cause = this.causeRepository.create(createDto)
        cause.cause_description = NameValidate.getInstance().getValidCause(cause.cause_description);
        cause.cause_created_at = new Date();
        return this.causeRepository.save(cause);
    }
    async update(id:number,updateDto:CreateCauseDto){
        const cause = await this.getById(id)
        if(!cause) throw new BadRequestException("Id invalido!")
        cause.cause_description = NameValidate.getInstance().getValidCause(updateDto.cause_description);
        return this.causeRepository.save(cause);
    }
    async getById(id:number){
        return this.causeRepository.createQueryBuilder('cause')
        .leftJoinAndSelect('cause.soluctions','soluctions')
        .leftJoinAndSelect('soluctions.soluctions','soluction')
        .where('cause.cause_id = :id',{id})
        .getOne();
    }
    async getOptions(){
        return this.causeRepository.createQueryBuilder('cause')
        .orderBy('cause.cause_description', 'ASC')
        .getMany();
    }
    async getByName(name:string){
        return this.causeRepository.createQueryBuilder('cause')
        .leftJoinAndSelect('cause.soluctions','soluctions')
        .where('cause.cause_description = :name',{name})
        .getOne();
    }
    async delete(id:number){
        const cause = await this.getById(id);
        if(!cause) throw new BadRequestException("id inválido!")
        const defectCause = await this.defectService.findCauseById(id)
        console.log(defectCause)
        if(defectCause) throw new BadRequestException('Causa vinculada a defeito, não é possível realizar a operação!')
        await this.soluctionCauseService.deleteById(id);
        return this.causeRepository.remove(cause);
    }
    
}