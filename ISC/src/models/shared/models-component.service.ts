import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { Repository } from "typeorm";
import { ModelsComponentEntity } from "../entities/models-component.entity";
import { UpdateModelsComponentDto } from "../dtos/update-models-component.dto";
import { CreateModelsComponentDto } from "../dtos/create-models-component.dto";


@Injectable()
export class ModelsComponentService{
    constructor(
        @InjectRepository(ModelsComponentEntity)
        private readonly modelsComponentRepository: Repository<ModelsComponentEntity>,
    ){}
    async getAll(){
        return this.modelsComponentRepository.createQueryBuilder('models')
        .leftJoinAndSelect('models.model','model')
        .leftJoinAndSelect('models.component','component')
        .getMany();
    }
    async create(createDto:CreateModelsComponentDto){
        const check = await this.findByIds(createDto.component_id,createDto.models_id)
        if(check) throw new BadRequestException('Modelo ja vinculado ao componenente!')
        return this.modelsComponentRepository.save(createDto);
    }
    async findByIds(idComponent:number,idModel:number){
        return await this.modelsComponentRepository.createQueryBuilder('models')
        .where('models.models_id = :idModel',{idModel})
        .andWhere('models.component_id = :idComponent',{idComponent})
        .getOne();
    }
    async findById(id:number){
        return this.modelsComponentRepository.createQueryBuilder('model')
        .where('model.component_id = :id',{id})
        .getOne();
    }
    async getById(id:number){
        return this.modelsComponentRepository.createQueryBuilder('models')
        .leftJoinAndSelect('models.model','model')
        .leftJoinAndSelect('models.component','component')
        .where('models.models_component_id = :id',{id})
        .getOne();
    }
    async deleteById(id:number){
        const list = await this.modelsComponentRepository.createQueryBuilder('model')
        .where('model.models_id = :id',{id})
        .getMany();
        list.forEach(async (element) =>{
            await this.delete(element.models_component_id);
        })
        return list;
    }
    async update(id:number,update:UpdateModelsComponentDto){
        const mComponent = await this.modelsComponentRepository.findOne({where: {models_component_id :id}});
        mComponent.component_id = update.component_id;

        return this.modelsComponentRepository.save(mComponent);
    }
    async delete(id:number){
        return this.modelsComponentRepository.delete(id);
    }
}