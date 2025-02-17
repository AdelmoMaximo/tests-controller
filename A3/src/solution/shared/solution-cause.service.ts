import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolutionCauseEntity } from '../entities/solution-cause.entity';
import { CreateSolutionCauseDto } from '../dto/create-solution-cause.dto';
import { BadRequestException } from 'src/common/exception-filters/bad-request.exception';
import { NameValidate } from 'src/common/utils/name.validate';
import { A3_CauseService } from 'src/cause/shared/a3_cause.service';
import { a3_registryService } from 'src/registry/shared/a3_registry.service';
import { UpdateSolutionCauseDto } from '../dto/update-solution-cause.dto';

@Injectable()
export class SolutionCauseService {
  constructor(
    @InjectRepository(SolutionCauseEntity)
    private readonly solutionCauseRepository: Repository<SolutionCauseEntity>,
    private readonly a3_CauseService: A3_CauseService,
    private readonly a3_registry: a3_registryService
  ) {}

  async getAll() {
    return this.solutionCauseRepository.find();
  }

  async getById(id: number) {
    const solutionCause = await this.solutionCauseRepository.findOne({where: {soluction_case_id: id}});
    if (!solutionCause) {
      throw new NotFoundException('Solution cause not found');
    }
    return solutionCause;
  }
  async create(soluctionDto:CreateSolutionCauseDto){
    const existSoluction = await this.verify(soluctionDto.a3_cause_id);

    if(existSoluction) throw new BadRequestException('Essa causa já foi resolvida!')
    
    const soluction = await this.solutionCauseRepository.create(soluctionDto);

    const cause = await this.a3_CauseService.getById(soluctionDto.a3_cause_id)
    if(!cause) throw new BadRequestException('Id de causa inválido!')

    const registry = await this.a3_registry.getById(soluctionDto.a3_registry_id)
    if(!registry) throw new BadRequestException('Id de registro inválido!')

    soluction.soluction_cause_created = new Date();
    soluction.soluction_cause_description =  NameValidate.getInstance().getSoluctionDescription(soluction.soluction_cause_description);

    return this.solutionCauseRepository.save(soluction);
  }
  async update(id: number, updateSoluction: UpdateSolutionCauseDto) {
    const soluction = await this.getById(id);

    soluction.soluction_cause_description =  NameValidate.getInstance().getSoluctionDescription(updateSoluction.soluction_cause_description);
    soluction.a3_user = (updateSoluction.a3_user)

    return this.solutionCauseRepository.save(soluction);
  }
  async verify(id:number){
    return await this.solutionCauseRepository.createQueryBuilder('soluction')
    .leftJoinAndSelect('soluction.cause','cause')
    .where('cause.a3_cause_id = :id',{id})
    .getOne();
  }

  async getByCauseId(id:number){
    return await this.solutionCauseRepository.createQueryBuilder('soluction')
    .leftJoinAndSelect('soluction.cause','cause')
    .where('cause.a3_cause_id = :id',{id})
    .getMany();
  }

  
  
  async delete (id: number) {
    const result = await this.getById(id);
  
    if (!result) {
      throw new NotFoundException(`Solução com id ${id} não encontrado!`);
    }
    return this.solutionCauseRepository.delete(id);
  }
  
}
