import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { SupplierEntity } from '../entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { NameValidate } from 'src/common/utils/name.validate';
import { SearchSupplierDto } from '../dto/search-supplier.dto';
import { ModelService } from 'src/models/shared/models.service';


@Injectable()
export class SupplierService {

  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,
    @Inject(forwardRef( () =>ModelService))
    private readonly modelService: ModelService
  ) { }
  async getValidate(codigo:string,abr:string,name:string){
    return this.supplierRepository.createQueryBuilder('sup')
    .where('sup.supplier_codigo = :codigo',{codigo})
    .orWhere('sup.supplier_abbreviation = :abr',{abr})
    .orWhere('sup.supplier_name = :name',{name})
    .getOne()
  }
  async getOptions(){
    return this.supplierRepository.createQueryBuilder('sup')
    .orderBy('sup.supplier_abbreviation', 'ASC')
    .getMany();
}
  async getByCode(code:string){
    return this.supplierRepository.createQueryBuilder('sup')
    .where('sup.supplier_codigo = :code',{code})
    .getOne();
  }
  async getByAbre(abr:string){
    return this.supplierRepository.createQueryBuilder('sup')
    .where('sup.supplier_abbreviation = :abr',{abr})
    .getOne()
  }
  getByName(name:string){
    return this.supplierRepository.createQueryBuilder('sup')
    .where('sup.supplier_name = :name',{name})
    .getOne()
  }
  async create(supplierData: CreateSupplierDto) {

    const existingSupplier = this.supplierRepository.create(supplierData);

    existingSupplier.supplier_codigo = NameValidate.getInstance().getValidCodigo(existingSupplier.supplier_codigo);
    existingSupplier.supplier_abbreviation = NameValidate.getInstance().getValidAbbreviation(existingSupplier.supplier_abbreviation);
    existingSupplier.supplier_name = NameValidate.getInstance().getValidSupplier(existingSupplier.supplier_name);

    const existsDto = await this.getValidate(existingSupplier.supplier_codigo,existingSupplier.supplier_abbreviation,existingSupplier.supplier_name)

    if (existsDto) {
      throw new BadRequestException(`Já existe fornecedor com mesmo código ou abreviatura ou nome!`);
    }

    return this.supplierRepository.save(existingSupplier);
  }

  async getAll(PaginationFilter: FilterWorkstation,search:SearchSupplierDto) {
    const { sort } = PaginationFilter
    const {search_name} = search

    const query = this.supplierRepository.createQueryBuilder('supplier');

    if(search_name){
      query.andWhere('supplier.supplier_name like :profileName',{profileName: `${search_name}%`})
    }

    query.orderBy('supplier.supplier_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
    return paginate<SupplierEntity>(query, PaginationFilter);
  }

  async getById(id: number) {

    const supplier = await this.supplierRepository.findOne({
      where: {
        supplier_id: id
      }
    });

    if (!supplier) {
      throw new NotFoundException(`Fornecedor com id ${id} não encontrado!`);
    }

    return supplier;

  }

  async update(id: number, supplierData: UpdateSupplierDto) {

    const existingSupplier = await this.supplierRepository.findOne({
      where: {
        supplier_id: id
      }
    });
    if(!existingSupplier) throw new BadRequestException("Id invalido!")
    
    existingSupplier.supplier_codigo = supplierData.supplier_codigo;
    existingSupplier.supplier_abbreviation = supplierData.supplier_abbreviation;
    existingSupplier.supplier_name = supplierData.supplier_name;

    existingSupplier.supplier_codigo = NameValidate.getInstance().getValidCodigo(existingSupplier.supplier_codigo);
    existingSupplier.supplier_abbreviation = NameValidate.getInstance().getValidAbbreviation(existingSupplier.supplier_abbreviation);
    existingSupplier.supplier_name = NameValidate.getInstance().getValidSupplier(existingSupplier.supplier_name);



    const existsDto = await this.getValidate(existingSupplier.supplier_codigo,existingSupplier.supplier_abbreviation,existingSupplier.supplier_name)

    if (existsDto && existsDto.supplier_id != id) {
      throw new BadRequestException(`Já existe fornecedor com mesmo código, abreviatura ou nome!`);
    }

    return this.supplierRepository.save(existingSupplier);

  }

  async delete(id: number) {

    const result = await this.getById(id);

    const model = await this.modelService.getBySupplier(id);

    if(model) throw new BadRequestException('Modelo atrelado a um fornecedor!')

    if (!result) {

      throw new NotFoundException(`Fornecedor com id ${id} não encontrado!`);

    }

    return this.supplierRepository.delete(id);

  }

}
