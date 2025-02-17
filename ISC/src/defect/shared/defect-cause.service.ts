import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { NameValidate } from "src/common/utils/name.validate";
import { SoluctionService } from "src/solution/shared/soluction.service";
import { Repository } from "typeorm";
import { DefectCauseEntity } from "../entities/defect-cause.entity";
import { CreateCauseDefectDto } from "../dtos/create-causedefect.dto";
import { UpdateCauseDefectDto } from "../dtos/update-causedefect.dto";


@Injectable()
export class DefectCauseService{
    constructor(
        @InjectRepository(DefectCauseEntity)
        private readonly defectRepository: Repository<DefectCauseEntity>,
    ){}
    async getAll(){
        return this.defectRepository.createQueryBuilder('defects')
        .leftJoinAndSelect('defects.defect','defect')
        .leftJoinAndSelect('defects.cause','cause')
        .getMany();
    }
    async create(createDto:CreateCauseDefectDto){
        const check = await this.findByIds(createDto.cause_id,createDto.defect_id)
        if(check) throw new BadRequestException('Causa ja vinculada ao defeito!')
        return this.defectRepository.save(createDto);
    }
    async findByIds(idCause:number,idDefect:number){
        return await this.defectRepository.createQueryBuilder('defect')
        .where('defect.defect_id = :idDefect',{idDefect})
        .andWhere('defect.cause_id = :idCause',{idCause})
        .getOne();
    }
    async findCauseById(id:number){
        return this.defectRepository.createQueryBuilder('defect')
        .where('defect.cause_id = :id',{id})
        .getOne();
    }
    async getById(id:number){
        return this.defectRepository.createQueryBuilder('defects')
        .leftJoinAndSelect('defects.defect','defect')
        .leftJoinAndSelect('defects.cause','cause')
        .where('defects.defect_cause_id = :id',{id})
        .getOne();
    }
    async deleteById(id:number){
        const list = await this.defectRepository.createQueryBuilder('defect')
        .where('defect.defect_id = :id',{id})
        .getMany();
        list.forEach(async (element) =>{
            await this.delete(element.defect_cause_id);
        })
        return list;
    }
    async update(id:number,update:UpdateCauseDefectDto){
        const sCause = await this.getById(id)
        sCause.cause_id = update.cause_id
        return this.defectRepository.save(sCause)
    }
    async delete(id:number){
        return this.defectRepository.delete(id);
    }
}