import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolutionSubcauseEntity } from '../entities/solution-subcause.entity';
import { CreateSolutionSubcauseDto } from '../dto/create-solution-subcause.dto';
import { BadRequestException } from 'src/common/exception-filters/bad-request.exception';
import { NameValidate } from 'src/common/utils/name.validate';
import { A3_CauseService } from 'src/cause/shared/a3_cause.service';
import { a3_registryService } from 'src/registry/shared/a3_registry.service';
import { A3_SubcauseService } from 'src/subcause/shared/a3_subcause.service';
import { UpdateSolutionSubcauseDto } from '../dto/update-solution-subcause.dto';

@Injectable()
export class SolutionSubcauseService {
  constructor(
    @InjectRepository(SolutionSubcauseEntity)
    private readonly solutionSubcauseRepository: Repository<SolutionSubcauseEntity>,
    private readonly a3_CauseService: A3_CauseService,
    private readonly a3_registry: a3_registryService,
    private readonly a3_SubcauseService: A3_SubcauseService
  ) {}

  async getAll() {
    return this.solutionSubcauseRepository.find();
  }

  async create(createDto:CreateSolutionSubcauseDto){
    const existSoluction = await this.verify(createDto.a3_subcause_id);

    if(existSoluction) throw new BadRequestException('This cause has been already solucted!')
    
    const soluction = await this.solutionSubcauseRepository.create(createDto);

    const cause = await this.a3_CauseService.getById(createDto.a3_cause_id)
    if(!cause) throw new BadRequestException('Id de causa inválido!')

    const registry = await this.a3_registry.getById(createDto.a3_registry_id)
    if(!registry) throw new BadRequestException('Id de registro inválido!')

    const subcause = await this.a3_SubcauseService.getById(createDto.a3_subcause_id)
    if(!subcause) throw new BadRequestException('Id de subcausa inválido!')

    soluction.soluction_subcause_created = new Date();
    soluction.soluction_subcause_description =  NameValidate.getInstance().getSoluctionDescription(soluction.soluction_subcause_description);

    const sub_soluction = await this.solutionSubcauseRepository.save(soluction);

    await this.a3_registry.changeStatus(soluction.a3_registry_id);

    return sub_soluction;
  }
  async update(id: number, updateSubSolution: UpdateSolutionSubcauseDto) {
    const SubSoluction = await this.getById(id);

    SubSoluction.soluction_subcause_description =  NameValidate.getInstance().getSoluctionDescription(updateSubSolution.soluction_subcause_description);
    SubSoluction.a3_user = (updateSubSolution.a3_user)

    return this.solutionSubcauseRepository.save(SubSoluction);
  }

  async getById(id: number) {
    const solutionSubcause = await this.solutionSubcauseRepository.findOne({where: {soluction_subcase_id: id}});
    if (!solutionSubcause) {
      throw new NotFoundException('Solution Subcause not found');
    }
    return solutionSubcause;
  }

  async verify(id:number){
    return await this.solutionSubcauseRepository.createQueryBuilder('soluction')
    .leftJoinAndSelect('soluction.subcause','subcause')
    .where('subcause.a3_subcause_id = :id',{id})
    .getOne();
  }

  async getByCauseId(id:number){
    return await this.solutionSubcauseRepository.createQueryBuilder('soluction')
    .leftJoinAndSelect('soluction.subcause','subcause')
    .where('subcause.a3_subcause_id = :id',{id})
    .getMany();
  }

  async delete (id: number) {
    const result = await this.getById(id);
  
    if (!result) {
      throw new NotFoundException(`Solução com id ${id} não encontrado!`);
    }
    return this.solutionSubcauseRepository.delete(id);
  }

}
