import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { a3_registryEntity } from '../entities/a3_registry.entity';
import { CreateA3_RegistryDto } from '../dto/create-registry.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { SearchRegistryDto } from '../dto/search-registry.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { NameValidate } from 'src/common/utils/name.validate';
import { UpdateA3_RegistryDto } from '../dto/update-registry.dto';
import { Cron } from '@nestjs/schedule';
import { A3_CauseService } from 'src/cause/shared/a3_cause.service';
import { A3_SubcauseService } from 'src/subcause/shared/a3_subcause.service';

@Injectable()
export class a3_registryService {
  constructor(
    @InjectRepository(a3_registryEntity)
    private readonly a3_registryRepository: Repository<a3_registryEntity>,
    @Inject(forwardRef(() => A3_CauseService))
    private readonly cause_service: A3_CauseService,
    
  ) {}

  @Cron('45 * * * * *')
  async verifyStatus(){
    const list = await this.a3_registryRepository.createQueryBuilder('registry')
    .leftJoinAndSelect('registry.a3_causes','cause')
    .leftJoinAndSelect('cause.soluctions','solutions')
    .leftJoinAndSelect('cause.a3_subcauses','subcause')
    .leftJoinAndSelect('subcause.subsoluctions','subsol')
    .where('registry.a3_registry_status = 0')
    .getMany();
    list.forEach(async (registry) => {
      var flag = true;
      if(registry.a3_causes.length > 0){
        registry.a3_causes.forEach( async (cause) =>{
          if(cause.a3_subcauses.length > 0){
            cause.a3_subcauses.forEach( subcause =>{
              if(subcause.subsoluctions.length == 0) flag =false;
            })
          }
          else{
            flag = false;
          }
        });
        if(flag){
          registry.a3_registry_status =1;
          await this.a3_registryRepository.save(registry);
        }
      }
    })
  }

  async changeStatus(id:number){
    const list = await this.a3_registryRepository.createQueryBuilder('registry')
    .leftJoinAndSelect('registry.a3_causes','cause')
    .leftJoinAndSelect('cause.soluctions','solutions')
    .leftJoinAndSelect('cause.a3_subcauses','subcause')
    .leftJoinAndSelect('cause.subcauses_soluctions','subsol')
    .where('registry.a3_registry_id = :id',{id})
    .getMany();
    list.forEach(async (registry) => {
      var flag = true;
      if(registry.a3_causes.length > 0){
        registry.a3_causes.forEach( async (cause) =>{
          if(cause.a3_subcauses.length > 0){
            if(cause.subcauses_soluctions.length === 0){
              flag = false;
            } 
          }
          else{
            flag = false;
          }
        });
        if(flag){
          registry.a3_registry_status =1;
          await this.a3_registryRepository.save(registry);
        }
      }
    })
    return
  }
  async getOptions2(name:string){
    return await this.a3_registryRepository.createQueryBuilder('registry')
    .where('registry.a3_registry_name = :name',{name})
    .getOne();
  }

  async getoptions(){
    return await this.a3_registryRepository.createQueryBuilder('registry')
    .where('registry.a3_registry_status = 0')
    .orderBy('registry.a3_registry_name','ASC')
    .getMany();
  }


  async getAll(PaginationFilter: FilterWorkstation, search: SearchRegistryDto) {
    const { sort } = PaginationFilter;
    const { search_name, order_type } = search;

    const query = this.a3_registryRepository.createQueryBuilder('registry');
    if (search_name) {
      query.andWhere(
        new Brackets((queryBuilderOne) => {
          queryBuilderOne
            .where('registry.a3_registry_id like :code', {code: `${search_name}%`})
            .orWhere('registry.a3_registry_description like :a3_description', {a3_description: `%${search_name}%`})
            .orWhere('registry.a3_registry_name like :a3_name', {a3_name: `%${search_name}%`});
        }),
      );
    }
    

    if(order_type == 1){
      query.orderBy('registry.a3_registry_id',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
    }
    else if(order_type == 2){
      query.orderBy('registry.a3_registry_lastModified',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
    } 
    else if(order_type == 3){
      query.orderBy('registry.a3_registry_name',`${sort === 'ASC' ? 'DESC': 'ASC'}`);
    }
    else if( order_type == 4){
      query.orderBy('registry.a3_registry_status',`${sort === 'ASC' ? 'DESC': 'ASC'}`);
    }
    else if( order_type == 5){
      query.orderBy('registry.a3_registry_status',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
    }
    
    return paginate<a3_registryEntity>(query, PaginationFilter);
  }

  async getById(id: number) {
    const a3_registry = await this.a3_registryRepository.createQueryBuilder('registry')
    .leftJoinAndSelect('registry.a3_causes','cause')
    .leftJoinAndSelect('cause.soluctions','soluctions')
    .leftJoinAndSelect('cause.a3_subcauses','subcause')
    .leftJoinAndSelect('cause.pdca','pdca')
    .leftJoinAndSelect('subcause.subsoluctions','subsol')
    .where('registry.a3_registry_id = :id',{id})
    .getOne();
    if (!a3_registry) {
      throw new NotFoundException('Id do registro inválido.');
    }
    return a3_registry;
  }

  async create(registryDto: CreateA3_RegistryDto) {
    const a3_registry = await this.a3_registryRepository.create(registryDto);


    a3_registry.a3_registry_createad = new Date();
    a3_registry.a3_registry_lastModified = new Date();
    NameValidate.getInstance().getValidRegistryName(registryDto.a3_registry_name);
    NameValidate.getInstance().getValidRegistryDescription(registryDto.a3_registry_description);
    a3_registry.a3_registry_status = 0;
   
    return await this.a3_registryRepository.save(a3_registry);
  }

  async update(id: number, updateRegistry: UpdateA3_RegistryDto) {
    const a3_registry = await this.getById(id);

    if (!a3_registry) {
      throw new BadRequestException('Id invalido!');
    }

    if(a3_registry.a3_registry_status == 1 ) throw new BadRequestException('Causa solucionada não pode ser editada!')

    a3_registry.a3_registry_lastModified = new Date();
    NameValidate.getInstance().getValidRegistryName(updateRegistry.a3_registry_name);
    NameValidate.getInstance().getValidRegistryDescription(updateRegistry.a3_registry_description);
    
    await this.a3_registryRepository.merge(a3_registry, updateRegistry);

    return this.a3_registryRepository.save(a3_registry);
  }

  async delete(id: number) {
    const result = await this.a3_registryRepository.createQueryBuilder('registry')
    .leftJoinAndSelect('registry.pdcaA3','pdcaA3')
    .leftJoinAndSelect('registry.a3_causes','cause')
    .leftJoinAndSelect('cause.a3_subcauses','subcause')
    .leftJoinAndSelect('subcause.subsoluctions','subsol')
    .where('registry.a3_registry_id = :id',{id})
    .getOne();

    if (!result) {
      throw new NotFoundException(`Registro com id ${id} não encontrado!`);
    }
    
    if(result.pdcaA3.length !=0){
      throw new BadRequestException('Registro atrelado a Pdca!')
    }
    result.a3_causes.forEach( cause => {
      cause.a3_subcauses.forEach( subcause => {
        if(subcause.subsoluctions.length !=0 ) throw new BadRequestException('Registro possui solução atrelada!');
      })
    })

    await this.cause_service.deleteAll(id);

    return this.a3_registryRepository.remove(result);
  }

}
