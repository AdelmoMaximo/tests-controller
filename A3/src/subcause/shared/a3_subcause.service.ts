import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { a3_subcauseEntity } from '../entities/a3_subcause.entity';
import { CreateA3_SubcauseDto } from '../dto/create-subcause.dto';
import { NameValidate } from 'src/common/utils/name.validate';
import { UpdateA3_SubcauseDto } from '../dto/update-subcause.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { SearchA3_SubcauseDto } from '../dto/search-subxause.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { A3_CauseService } from 'src/cause/shared/a3_cause.service';
import { a3_registryService } from 'src/registry/shared/a3_registry.service';


@Injectable()
export class A3_SubcauseService {
  constructor(
    @InjectRepository(a3_subcauseEntity)
    private readonly a3_subcauseRepository: Repository<a3_subcauseEntity>,
    @Inject(forwardRef(() => A3_CauseService))
    private readonly a3_CauseService: A3_CauseService,
    private readonly a3_registryService: a3_registryService
  ) {}

  async getAll(PaginationFilter:FilterWorkstation,search:SearchA3_SubcauseDto){
    const { sort } = PaginationFilter
    const {search_name} = search

    const query = this.a3_subcauseRepository.createQueryBuilder('subcause')
    if(search_name){
        query
        .andWhere(new Brackets(queryBuilderOne => {
            queryBuilderOne
            .where('subcause.a3_subcause_id like :code',{code: `${search_name}%`})
            .orWhere('subcause.a3_subcause_name like :a3_name',{a3_name: `${search_name}%`})
    }));
    }

    query.orderBy('subcause.a3_subcause_id',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
  
    return paginate<a3_subcauseEntity>(query,PaginationFilter);
}

async getById(id: number) {
  const a3_cause = await this.a3_subcauseRepository.createQueryBuilder('subcause')
  .leftJoinAndSelect('subcause.cause','cause')
  .leftJoinAndSelect('subcause.subsoluctions','soluction')
  .where('subcause.a3_subcause_id = :id',{id})
  .getOne();
  if (!a3_cause) {
    throw new NotFoundException('Id de subcausa inválido!');
  }
  return a3_cause;
}


  async create(createA3_subauseDto: CreateA3_SubcauseDto) {

    const subcause = await this.a3_subcauseRepository.create(createA3_subauseDto);

    const cause = await this.a3_CauseService.getById(createA3_subauseDto.a3_cause_id)
    if(!cause) throw new BadRequestException('Id de causa inválido!')

    const registry = await this.a3_registryService.getById(createA3_subauseDto.a3_registry_id)
    if(!registry) throw new BadRequestException('Id de registro inválido!')

    if (await this.maxSubcausa(subcause.a3_cause_id, 2)) {
      throw new BadRequestException('A causa já possui o máximo de subcausas permitidas.');
    }

    subcause.a3_subcause_description = NameValidate.getInstance().getA3CauseDescripition(createA3_subauseDto.a3_subcause_description);

    return await this.a3_subcauseRepository.save(subcause);
  }
  private async maxSubcausa(a3_cause_id: number, maxCount: number): Promise<boolean> {
    const [subcauses, subcausesCount] = await this.a3_subcauseRepository.findAndCount({
      where: { a3_cause_id },
    });

    return subcausesCount >= maxCount;
  }

  async update(id: number, updateSubcause: UpdateA3_SubcauseDto) {
    const subcause = await this.getById(id);

    if (!subcause) {
      throw new BadRequestException('Id invalido!');
    }
    subcause.a3_subcause_description = NameValidate.getInstance().getA3CauseDescripition(updateSubcause.a3_subcause_description);

    return await this.a3_subcauseRepository.save(subcause);
  }

  async existingSubs(a3_cause_id: number): Promise<boolean> {
    const subcauses = await this.a3_subcauseRepository.find({ where: { a3_cause_id } });
    return subcauses.length > 0;
}

async deleteAll(id:number){
  const list = await this.a3_subcauseRepository.createQueryBuilder('subcause')
    .where('subcause.a3_registry_id = :id',{id})
    .getMany();

    list.forEach(async (cause) => {
      await this.a3_subcauseRepository.remove(cause);
    });
    
    return
}

  
  async delete (id: number) {

    const result = await this.getById(id);
  
    if (!result) {
  
      throw new NotFoundException(`Subcausa com id ${id} não encontrado!`);
  
    }
  
    return this.a3_subcauseRepository.delete(id);
  
  }

  


}