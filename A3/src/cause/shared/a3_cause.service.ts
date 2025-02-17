import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { a3_causeEntity } from '../entities/a3_cause.entity';
import { CreateA3_CauseDto } from '../dto/create-cause.dto';
import { UpdateA3_CauseDto } from '../dto/update-cause.dto';
import { NameValidate } from 'src/common/utils/name.validate';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { SearchA3_CauseDto } from '../dto/search-cause.dto';
import { a3_registryService } from 'src/registry/shared/a3_registry.service';
import { a3_subcauseEntity } from 'src/subcause/entities/a3_subcause.entity';
import { A3_SubcauseService } from 'src/subcause/shared/a3_subcause.service';
@Injectable()

export class A3_CauseService {
  constructor(
    @InjectRepository(a3_causeEntity)
    private readonly a3_causeRepository: Repository<a3_causeEntity>,
    @Inject(forwardRef(() => a3_registryService))
    private readonly a3_registry: a3_registryService,
    @Inject(forwardRef(() => A3_SubcauseService))
    private readonly a3_subcause: A3_SubcauseService
  ) {}
  
  async getAll(PaginationFilter:FilterWorkstation,search:SearchA3_CauseDto){
    const { sort } = PaginationFilter
    const {search_name} = search

    const query = this.a3_causeRepository.createQueryBuilder('cause')
    if(search_name){
        query
        .andWhere(new Brackets(queryBuilderOne => {
            queryBuilderOne
            .where('cause.a3_cause_id like :code',{code: `${search_name}%`})
            .orWhere('cause.a3_cause_name like :a3_name',{a3_name: `${search_name}%`})
    }));
    }

    query.orderBy('cause.a3_cause_id',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
  
    return paginate<a3_causeEntity>(query,PaginationFilter);
}

  async getById(id: number) {
    const a3_cause = await this.a3_causeRepository.createQueryBuilder('cause')
    .leftJoinAndSelect('cause.soluctions','soluctions')
    .leftJoinAndSelect('cause.a3_subcauses','subcauses')
    .leftJoinAndSelect('cause.subcauses_soluctions','subcauses_soluctions')
    .leftJoinAndSelect('cause.registry', 'registry')  
    .leftJoinAndSelect('cause.pdca', 'pdca')
    .where('cause.a3_cause_id = :id',{id})
    .getOne();
    if (!a3_cause) {
      throw new NotFoundException('Id de causa inválido!');
    }
    return a3_cause;
  }
  private categorys = ['ENVIRONMENT', 'METHOD', 'MANPOWER', 'RAW_MATERIAL', 'MACHINE', 'MEASURE']
  async create(createA3_CauseDto: CreateA3_CauseDto): Promise<a3_causeEntity> {

    const cause = await this.a3_causeRepository.create(createA3_CauseDto)

    const registry = await this.a3_registry.getById(createA3_CauseDto.a3_registry_id)
    if(!registry) throw new BadRequestException('Id de registro inválido!')

    if (this.isValidCategory(createA3_CauseDto.a3_cause_category)) {
      cause.a3_cause_category = createA3_CauseDto.a3_cause_category;
    } else {
      throw new BadRequestException('Categoria inválida');
    }

    if (await this.maxCause(cause.a3_registry_id,cause.a3_cause_category, 5)) {
      throw new BadRequestException('O problema já possui o máximo de causas permitidas.');
    }

    cause.a3_cause_description = NameValidate.getInstance().getA3CauseDescripition(createA3_CauseDto.a3_cause_description);

    return await this.a3_causeRepository.save(cause);
  }

  private async maxCause(a3_registry_id: number, category:string, maxCount: number): Promise<boolean> {
    const list = await this.a3_causeRepository.createQueryBuilder('cause')
    .where('cause.a3_registry_id = :a3_registry_id',{a3_registry_id})
    .andWhere('cause.a3_cause_category = :category',{category})
    .getMany();
    console.log(list);
    return list.length >= maxCount;
  }
  async verifyPdcaExistence(id: number): Promise<boolean> {
    const a3_cause = await this.getById(id); 

    return a3_cause.pdca.length > 0; 
}
  async verifySoluctionsExistence(id: number): Promise<boolean> {
  const a3_cause = await this.getById(id); 

  return a3_cause.soluctions.length > 0; 
}

  private isValidCategory(category: string): boolean {
    return this.categorys.includes(category);
  }

  async update(id: number, updateCause: UpdateA3_CauseDto) {
    const a3_cause = await this.getById(id);


    const existSoluction = await this.verifySoluctionsExistence(id);
    if(existSoluction) throw new BadRequestException('Essa causa não pode ser editada pois já foi resolvida!')

    const existPDCA = await this.verifyPdcaExistence(id);
    if(existPDCA) throw new BadRequestException('Essa causa não pode ser editada pois possue relação PDCA!')

    if (this.isValidCategory(updateCause.a3_cause_category)) {
      a3_cause.a3_cause_category = updateCause.a3_cause_category;
    } else {
      throw new BadRequestException('Categoria inválida');
    }
    if (await this.maxCause(a3_cause.a3_registry_id,a3_cause.a3_cause_category, 5)) {
      throw new BadRequestException('O problema já possui o máximo de causas permitidas.');
    }
    a3_cause.a3_cause_description = NameValidate.getInstance().getA3CauseDescripition(updateCause.a3_cause_description);

    return await this.a3_causeRepository.save(a3_cause);
  }

  async getRegistryCause(id:number){
    const list = await this.a3_causeRepository.createQueryBuilder('cause')
    .leftJoinAndSelect('cause.registry','registry')
    .leftJoinAndSelect('cause.a3_subcauses','subcauses')
    .leftJoinAndSelect('cause.subcauses_soluctions','soluctions')
    .where('registry.a3_registry_id = :id',{id})
    .orderBy('cause.a3_cause_description','ASC')
    .getMany();

    const nlist = list.filter( cause =>{
      if(cause.a3_subcauses.length != cause.subcauses_soluctions.length) return cause;
    })
    return nlist
  }

  async verify(id:number){
    return await this.a3_causeRepository.createQueryBuilder('cause')
    .leftJoinAndSelect('cause.a3_subcauses','subcauses')
    .where('subcauses.a3_cause_id = :id',{id})
    .getMany();
  }
  async deleteAll(id:number){
    await this.a3_subcause.deleteAll(id);

    const list = await this.a3_causeRepository.createQueryBuilder('cause')
    .where('cause.a3_registry_id = :id',{id})
    .getMany();

    list.forEach(async (cause) => {
      await this.a3_causeRepository.remove(cause);
    });

    return
  }

  async delete (id: number) {

    const result = await this.getById(id);

    const verify = await this.verify(id);

    if(verify.length> 0) throw new BadRequestException('Causa possui subcausas atreladas!')

    const existSoluction = await this.verifySoluctionsExistence(id);
    if(existSoluction) throw new BadRequestException('Essa causa não pode ser excluida pois já foi resolvida!')


    const existPDCA = await this.verifyPdcaExistence(id);
    if(existPDCA) throw new BadRequestException('Essa causa não pode ser excluída pois possue relação PDCA!')

    if (!result) {
  
      throw new NotFoundException(`Causa com id ${id} não encontrado!`);
  
    }

    return this.a3_causeRepository.delete(id);
  
  }


}
