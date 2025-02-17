import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { Repository } from "typeorm";
import { ComponentEntity } from "../entities/component.entity";
import { CreateComponentDto } from "../dtos/create-component.dto";
import { SearchComponentDto } from "../dtos/search-component.dto";
import { NameValidate } from "src/common/utils/name.validate";
import { ModelsComponentService } from "src/models/shared/models-component.service";


@Injectable()
export class ComponentService{
    constructor(
        @InjectRepository(ComponentEntity)
        private readonly componentRepository: Repository<ComponentEntity>,
        private readonly modelComponentService: ModelsComponentService
    ){}
    async getAll(PaginationFilter:FilterWorkstation,search:SearchComponentDto){
        const { sort } = PaginationFilter
        const {search_name} = search

        const query = this.componentRepository.createQueryBuilder('component')
        if(search_name){
            query.andWhere('component.component_descrition like :profileName',{profileName: `${search_name}%`})
        }
        query.orderBy('component.component_descrition',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
        return paginate<ComponentEntity>(query,PaginationFilter);
    }
    async create(createDto:CreateComponentDto){
        const component_name = await this.getByName(createDto.component_descrition)

        if(component_name) throw new BadRequestException("Componente já cadastrado!")
        const defect = this.componentRepository.create(createDto)
        defect.component_descrition = NameValidate.getInstance().getValidComponent(defect.component_descrition);
        return this.componentRepository.save(defect);
    }
    async getById(id:number){
        return this.componentRepository.createQueryBuilder('component')
        .where('component.component_id = :id',{id})
        .getOne();
    }
    async getOptions(){
        return this.componentRepository.createQueryBuilder('component')
        .orderBy('component.component_descrition', 'DESC')
        .getMany();
    }
    async getByName(name:string){
        return this.componentRepository.createQueryBuilder('component')
        .where('component.component_descrition = :name',{name})
        .getOne();
    }
    async edit(id:number,updateDto:CreateComponentDto){
        const component = await this.getById(id)
        if(!component) throw new BadRequestException("Id invalido!")
        const component_name = await this.getByName(updateDto.component_descrition)
        if(component_name)throw new BadRequestException("Componente ja cadastrado!")

        component.component_descrition= NameValidate.getInstance().getValidComponent(updateDto.component_descrition);
        return this.componentRepository.save(component)
    }
    async delete(id:number){
        const link = await this.modelComponentService.findById(id);
        if(link)throw new BadRequestException('Componente vinculado a modelo, não é possível realizar a operação!')

        return this.componentRepository.delete(id);
    }
    
}