import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { NameValidate } from "src/common/utils/name.validate";
import { SoluctionService } from "src/solution/shared/soluction.service";
import { Repository } from "typeorm";
import { CreateSoluctionCauseDto } from "../dtos/create-cause-soluction.dto";
import { UpdateSoluctionCauseDto } from "../dtos/edit-cause-soluction.dto";
import { SoluctionCauseEntity } from "../entities/soluction-cause.entity";


@Injectable()
export class SoluctionCauseService{
    constructor(
        @InjectRepository(SoluctionCauseEntity)
        private readonly soluctionRepository: Repository<SoluctionCauseEntity>,
    ){}
    async getAll(){
        return this.soluctionRepository.createQueryBuilder('soluction')
        .leftJoinAndSelect('soluction.soluctions','soluctions')
        .getMany();
    }
    async create(createDto:CreateSoluctionCauseDto){
        const check = await this.findByIds(createDto.cause_id,createDto.soluction_id);
        if(check) throw new BadRequestException('Solucao ja vinculada a causa!')
        return this.soluctionRepository.save(createDto);
    }
    async findByIds(idCause:number,idSoluction:number){
        return await this.soluctionRepository.createQueryBuilder('soluction')
        .leftJoinAndSelect('soluction.soluctions','soluctions')
        .where('soluction.soluction_id = :idSoluction',{idSoluction})
        .andWhere('soluction.cause_id = :idCause',{idCause})
        .getOne();
    }
    async findSoluctionById(id:number){
        return this.soluctionRepository.createQueryBuilder('soluction')
        .leftJoinAndSelect('soluction.soluctions','soluctions')
        .where('soluction.soluction_id = :id',{id})
        .getOne();
    }
    async update(id:number,update:UpdateSoluctionCauseDto){
        const sCause = await this.getById(id)
        sCause.soluction_id = update.soluction_id
        return this.soluctionRepository.save(sCause)
    }
    async getById(id:number){
        return this.soluctionRepository.createQueryBuilder('soluction')
        .leftJoinAndSelect('soluction.soluctions','soluctions')
        .where('soluction.soluction_cause_id = :id',{id})
        .getOne();
    }
    async deleteById(id:number){
        const list = await this.soluctionRepository.createQueryBuilder('soluction')
        .where('soluction.cause_id = :id',{id})
        .getMany();
        list.forEach(async (element) =>{
            await this.delete(element.soluction_cause_id);
        })
        return list;
    }
    async delete(id:number){
        return this.soluctionRepository.delete(id);
    }
}