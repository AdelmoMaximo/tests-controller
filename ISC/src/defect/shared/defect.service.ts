 import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { Brackets, Repository } from "typeorm";
import { CreateDefectDto } from "../dtos/create-defect.dto";
import { DefectEntity } from "../entities/defect.entity";
import { NameValidate } from "src/common/utils/name.validate";
import { SearchDefectDto } from "../dtos/search-defect.dto";
import { DefectCauseService } from "./defect-cause.service";


@Injectable()
export class DefectService{
    constructor(
        @InjectRepository(DefectEntity)
        private readonly defectRepository: Repository<DefectEntity>,
        private readonly defectCauseService: DefectCauseService
    ){}
    async getAll(PaginationFilter:FilterWorkstation,search:SearchDefectDto){
        const { sort } = PaginationFilter
        const {search_name} = search

        const query = this.defectRepository.createQueryBuilder('defect')
        if(search_name){
            query
            .andWhere(new Brackets(queryBuilderOne => {
                queryBuilderOne
                .where('defect.defect_description like :descriptionName',{descriptionName: `${search_name}%`})
                .orWhere('defect.defect_code like :code',{code: `${search_name}%`})
        }));
        }

        query.orderBy('defect.defect_description',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
        return paginate<DefectEntity>(query,PaginationFilter);
    }
    async create(createDto:CreateDefectDto){
        const soluction_name = await this.getValidate(createDto.defect_code,createDto.defect_description)
        
        if(soluction_name) throw new BadRequestException("Defeito ou codigo ja cadastrado!")

        const defect = this.defectRepository.create(createDto)
        defect.defect_code = NameValidate.getInstance().getValidCode(createDto.defect_code)
        defect.defect_description = NameValidate.getInstance().getValidDefect(defect.defect_description)
        return this.defectRepository.save(defect);
    }
    async getById(id:number){
        const defect = await this.defectRepository.createQueryBuilder('defect')
        .leftJoinAndSelect('defect.defects','defects')
        .leftJoinAndSelect('defects.cause','cause')
        .where('defect.defect_id = :id',{id})
        .getOne();
        if(!defect) throw new BadRequestException("Id invalido!")
        return defect
    }
    async getbyCode(codigo:string){
        return this.defectRepository.createQueryBuilder('sup')
        .where('sup.defect_code = :codigo',{codigo})
        .getOne()
    }
    async getValidate(codigo:string,name:string){
        return this.defectRepository.createQueryBuilder('sup')
        .where('sup.defect_description = :name',{name})
        .orWhere('sup.defect_code = :codigo',{codigo})
        .getOne()
      }
    async getOptions(){
        return this.defectRepository.createQueryBuilder('defect')
        .orderBy('defect.defect_description', 'DESC')
        .getMany();
    }
    async getByName(name:string){
        return this.defectRepository.createQueryBuilder('defect')
        .where('defect.defect_description = :name',{name})
        .getOne();
    }
    async edit(id:number,createDto:CreateDefectDto){
        const defect = await this.getById(id)
        defect.defect_description = NameValidate.getInstance().getValidDefect(createDto.defect_description);
        defect.defect_code = NameValidate.getInstance().getValidCode(createDto.defect_code)

        const defect_name = await this.getValidate(createDto.defect_code,createDto.defect_description)
        if(defect_name && defect_name.defect_id!=id)throw new BadRequestException("Defeito ou codigo ja cadastrado na base!")
        return this.defectRepository.save(defect)
    }
    async delete(id:number){
        const defect = await this.getById(id)
        await this.defectCauseService.deleteById(id);
        return this.defectRepository.remove(defect);
    }
    
}