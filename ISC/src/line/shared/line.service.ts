import { BadRequestException, CacheKey, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { lineEntity } from '../entities/line.entity';
import { CreateLineDto } from '../dtos/create-line.dto';
import { NameValidate } from 'src/common/utils/name.validate';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { SearchLineDto } from '../dtos/search-line.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { converteBooleanToBit } from 'src/common/utils/boolean.bit';
import { UpdateLineDto } from '../dtos/update-line.dto';
import { PatchLineDto } from '../dtos/patch-line.dto';
import { stat } from 'fs';


@Injectable()
export class LineService {
  constructor(
    @InjectRepository(lineEntity)
    private readonly lineRepository: Repository<lineEntity>,
  ) {}

  async getAll(PaginationFilter: FilterWorkstation, search: SearchLineDto) {
    const { sort } = PaginationFilter;
    const { search_name } = search;
    const { order_type } = search;
  
    const query = this.lineRepository.createQueryBuilder('line');
  
    if (order_type) {
      query.andWhere('line.status_line LIKE :orderType', { orderType: `${order_type}%` });
    }
  
    if(search_name){
      query.andWhere(
          new Brackets(queryBuilderOne =>{
              queryBuilderOne
              .where('line.line_name like :lineName',{lineName: `${search_name}%`})
              .orWhere('line.phase_name like :phaseName',{phaseName: `${search_name}%`})
              .orWhere('line.phase_line like :phaseLine',{phaseLine: `${search_name}%`})
          })
      )
  }
  
    query.orderBy('line.line_name', sort === 'DESC' ? 'DESC' : 'ASC');
    return paginate<lineEntity>(query, PaginationFilter);
  }
  


  async findAll(): Promise<lineEntity[]> {
    return await this.lineRepository.find();
  }

  async create(createLineDto: CreateLineDto): Promise<lineEntity> {
    const line = new lineEntity();
    line.line_name = NameValidate.getInstance().getValidLine(createLineDto.line_name);
    line.phase_name = NameValidate.getInstance().getValidPhase(createLineDto.phase_name);
    
    const phaseExists = await this.verifyPhase(createLineDto.phase_name);
    if (phaseExists) {
      throw new BadRequestException('O nome da fase já existe!');
    }
    line.status_line = true;
    line.phase_line = `${createLineDto.line_name}-${createLineDto.phase_name}`;
    line.line_create_date = new Date();
    line.line_create_user = NameValidate.getInstance().getValidName(createLineDto.line_create_user)
    line.line_update_date = line.line_create_date
    line.line_update_user = NameValidate.getInstance().getValidName(createLineDto.line_create_user)
    return await this.lineRepository.save(line);
  }

  async verifyPhase(phase_name: string): Promise<boolean> {
    const line = await this.lineRepository.findOne({ where: { phase_name: phase_name } });
    return !!line;
  }
  
  async getById(id: number) {

    const line = await this.lineRepository.findOne({ where: { registration_line_id : id} });

    if (!line) {
      throw new NotFoundException(`Linha com o ID ${id} não encontrado`);
    }
    return line;
  }

  async update(id: number, UpdateLineDto: UpdateLineDto): Promise<lineEntity> {
    const line = await this.getById(id);
    if (!line) throw new BadRequestException("Id não encontrado!");
  
    line.line_name = NameValidate.getInstance().getValidLine(UpdateLineDto.line_name);
  
    if (line.phase_name !== UpdateLineDto.phase_name) {
      const phaseExists = await this.verifyPhase(UpdateLineDto.phase_name);
      if (phaseExists) {
        throw new BadRequestException('O nome da fase já existe !');
      }
      line.phase_name = NameValidate.getInstance().getValidPhase(UpdateLineDto.phase_name);
    }
  
    line.status_line = (UpdateLineDto.status_line);
    line.phase_line = `${UpdateLineDto.line_name}-${UpdateLineDto.phase_name}`;
    line.line_update_date = new Date();
    line.line_update_user = NameValidate.getInstance().getValidName(UpdateLineDto.line_update_user)

    return await this.lineRepository.save(line);
  }

  async edit(id: number, patch: PatchLineDto) {
    const line = await this.getById(id);
    line.status_line = Boolean(patch.status_line);
    //console.log(line);
    return await this.lineRepository.save(line);
  }

  async getOptions(){
    return this.lineRepository.createQueryBuilder('line')
    .orderBy('line.line_name', 'ASC')
    .getMany();
}
  async getByLine(namel:string){
    return this.lineRepository.createQueryBuilder('line')
    .where('line.line_name = :namel',{namel})
    .getOne();
  }
  async getByPhase(namep:string){
    return this.lineRepository.createQueryBuilder('line')
    .where('line.phase_name = :namep',{namep})
    .getOne()
  }



}
