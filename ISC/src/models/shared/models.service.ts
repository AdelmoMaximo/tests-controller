import { ComponentService } from './../../component/shared/component.service';
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { Repository } from "typeorm";
import { ModelsEntity } from "../entities/models.entity";
import { SearchDto } from "src/common/utils/search.dto";
import { CreateModelsDto } from "../dtos/create-models.dto";
import { NameValidate } from "src/common/utils/name.validate";
import { ModelsComponentService } from "./models-component.service";
import { UpdateModelsDto } from '../dtos/update-models.dto';
import { SupplierEntity } from 'src/supplier/entities/supplier.entity';
import { SupplierService } from 'src/supplier/shared/supplier.service';


@Injectable()
export class ModelService{
    constructor(
        @InjectRepository(ModelsEntity)
        private readonly modelsRepository: Repository<ModelsEntity>,
        @Inject(forwardRef( () =>SupplierService))
        private readonly supplierService: SupplierService,
        private readonly modelsComponentService: ModelsComponentService,
    ){}
    async getAll(PaginationFilter:FilterWorkstation,search:SearchDto){
        const { sort } = PaginationFilter
        const {search_name} = search

        const query = this.modelsRepository.createQueryBuilder('models')
        query.leftJoinAndSelect('models.supplier','supplier');
        if(search_name){
            query.andWhere('models.models_name like :profileName',{profileName: `${search_name}%`})
        }

        query.orderBy('models.models_identity',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
        return paginate<ModelsEntity>(query,PaginationFilter);
    }
    async create(createDto:CreateModelsDto){
        const model_name = await this.getByName(createDto.models_name)
        const models_identity = await this.getByIdentity(createDto.models_identity)

        if(model_name) throw new BadRequestException("Nome do modelo ja cadastrada!")
        if(models_identity) throw new BadRequestException("Identificador do modelo ja cadastrada!")

        const model = this.modelsRepository.create(createDto)
        model.models_name = NameValidate.getInstance().getValidModel(createDto.models_name)
        model.models_identity = NameValidate.getInstance().getValidIdentity(createDto.models_identity)
        model.models_create_date = new Date();
        return this.modelsRepository.save(model);
    }
    async update(id: number, updateDto: UpdateModelsDto) {
        const model = await this.getById2(id);
        if (!model) throw new BadRequestException("Id invalido!");
      
        const model_name = await this.getByName(updateDto.models_name);
        const models_identity = await this.getByIdentity(updateDto.models_identity);
      
        if (model_name && model_name.models_id != id) throw new BadRequestException("Nome do modelo já cadastrado!");
        if (models_identity && models_identity.models_id != id) throw new BadRequestException("Identificador do modelo já cadastrado!");
      
        const supplier = await this.supplierService.getById(updateDto.supplier_id);
        if (!supplier) throw new BadRequestException("ID do fornecedor inválido!");
    
        model.models_name = NameValidate.getInstance().getValidModel(updateDto.models_name);
        model.models_identity = NameValidate.getInstance().getValidIdentity(updateDto.models_identity);
        model.models_update_user = updateDto.models_update_user;
        model.models_update_date = new Date();
        model.supplier_id = updateDto.supplier_id;
        const modelRepository = await this.modelsRepository.save({...model,...updateDto});

            return modelRepository;
    }
    async getById2(id:number){
        return this.modelsRepository.createQueryBuilder('model')
        .where('model.models_id = :id',{id})
        .getOne();
    }
      
    async getById(id:number){
        return this.modelsRepository.createQueryBuilder('model')
        .leftJoinAndSelect('model.supplier','supplier')
        .leftJoinAndSelect('model.models_component','models_component')
        .leftJoinAndSelect('models_component.component','component')
        .where('model.models_id = :id',{id})
        .getOne();
    }
    async getOptions(){
        return this.modelsRepository.createQueryBuilder('model')
        .orderBy('model.models_identity', 'ASC')
        .getMany();
    }
    async getByName(name:string){
        return this.modelsRepository.createQueryBuilder('model')
        .where('model.models_name = :name',{name})
        .getOne();
    }
    async getByIdentity(identity:string){
        return this.modelsRepository.createQueryBuilder('model')
        .where('model.models_identity = :identity',{identity})
        .getOne();
    }
    async getBySupplier(id:number){
        return this.modelsRepository.createQueryBuilder('model')
        .leftJoinAndSelect('model.supplier','supplier')
        .leftJoinAndSelect('model.models_component','models_component')
        .leftJoinAndSelect('models_component.component','component')
        .where('supplier.supplier_id = :id',{id})
        .getOne();
    }
    async delete(id:number){
        const cause = await this.getById(id);
        if(!cause) throw new BadRequestException("id inválido!");

        await this.modelsComponentService.deleteById(id);
        return this.modelsRepository.remove(cause);
    }
    
}