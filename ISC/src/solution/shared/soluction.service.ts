import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { NameValidate } from "src/common/utils/name.validate";
import { Repository } from "typeorm";
import { CreateSoluctionDto } from "../dtos/create-soluction.dto";
import { SoluctionEntity } from "../entities/soluction.entity";
import { SearchSoluctionDto } from "../dtos/search-soluction.dto";
import { SoluctionCauseService } from "src/cause/shared/soluction-cause.service";


@Injectable()
export class SoluctionService{
    constructor(
        @InjectRepository(SoluctionEntity)
        private readonly soluctionRepository: Repository<SoluctionEntity>,
        private readonly soluctionCauseService: SoluctionCauseService
    ){}
    async createSoluction(createDto:CreateSoluctionDto){
        const soluction_name = await this.getByName(createDto.soluction_description)

        if(soluction_name) throw new BadRequestException("Solucao ja cadastrada!")

        const newSoluction = this.soluctionRepository.create(createDto);
        newSoluction.soluction_created_at = new Date();
        newSoluction.soluction_description = NameValidate.getInstance().getValidSolution(createDto.soluction_description)
        return this.soluctionRepository.save(newSoluction);
    }
    async getById(id:number){
        return this.soluctionRepository.findOne({where:{soluction_id:id}});
    }
    async getSoluctions(PaginationFilter:FilterWorkstation,search:SearchSoluctionDto){
        const { sort } = PaginationFilter
        const { search_name } = search

        const query = this.soluctionRepository.createQueryBuilder('soluction')

        if(search_name){
            query.andWhere('soluction.soluction_description like :profileName',{profileName: `${search_name}%`})
        }

        query.orderBy('soluction.soluction_description',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
        return paginate<SoluctionEntity>(query,PaginationFilter);
    }
    async edit(id:number,createDto:CreateSoluctionDto){
        const soluction = await this.getById(id)
        if(!soluction) throw new BadRequestException("Id invalido!")
        const soluction_name = await this.getByName(createDto.soluction_description)

        if(soluction_name) throw new BadRequestException("Solucao ja cadastrada!")
        soluction.soluction_description = NameValidate.getInstance().getValidSolution(createDto.soluction_description);
        return this.soluctionRepository.save(soluction)
    }
    async delete(id:number){
        const exist_cause = await this.soluctionCauseService.findSoluctionById(id)
        if(exist_cause) throw new BadRequestException('Solução vinculada a causa, não é possível realizar a operação!')
        const soluction = await this.getById(id);
        return this.soluctionRepository.remove(soluction);
    }
    async getByName(name:string){
        return this.soluctionRepository.createQueryBuilder('soluction')
        .where('soluction.soluction_description = :name',{name})
        .getOne()
    }
    async getOptions(){
        return this.soluctionRepository.createQueryBuilder('soluction')
        .orderBy('soluction.soluction_description', 'ASC')
        .getMany();
    }
}