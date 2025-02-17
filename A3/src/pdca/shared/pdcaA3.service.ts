import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { PdcaA3Entity } from '../entities/pdcaa3.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreatePdcaA3Dto } from '../dto/create-pdcaA3.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { QueryPdcaDto } from '../dto/query-pdca.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { Cron } from '@nestjs/schedule';
import { PdcaService } from './pdca.service';
import { PageRequest } from 'src/common/pagination/page-request.model';
import { pdcaA3ElementDto } from '../dto/paginate-dto';
import { Page } from 'src/common/pagination/page.model';
import { NotifyService } from 'src/notify/shared/notify.service';
import { UpdatePdcaA3Dto } from '../dto/update-pdcaA3.dto';
import { NameValidate } from 'src/common/utils/name.validate';
import { response } from 'express';

@Injectable()
export class PdcaA3Service {
  constructor(
    @InjectRepository(PdcaA3Entity)
    private readonly pdcaA3Repository: Repository<PdcaA3Entity>,
    @Inject(forwardRef(() => PdcaService))
    private readonly pdcaService: PdcaService,
    private readonly notifyService: NotifyService
  ) {}

  @Cron('15 * * * * *')
  async updateStatus() {
    const list = await this.pdcaA3Repository
      .createQueryBuilder('pdcaA3')
      .leftJoinAndSelect('pdcaA3.pdca', 'pdca')
      .leftJoinAndSelect('pdcaA3.registry','registry')
      .where('pdcaA3.pdcaa3_status < 100 AND pdcaA3.pdcaa3_is_close = 0')
      .getMany();

    const hoje = new Date();
    var menor = new Date();
    var maior = new Date();

    list.forEach(async (pdcaA3) => {

      if(pdcaA3.pdca.length != 0){
        pdcaA3.pdca.forEach(async (pdca, i) => {
          if (i == 0) {
            menor = new Date(pdca.pdca_when);
            maior = new Date(pdca.pdca_when_end);
          } else {
            if (pdca.pdca_when < menor) menor = new Date(pdca.pdca_when);
            if (pdca.pdca_when_end > maior) maior = new Date(pdca.pdca_when_end);
          }
        });
        if(hoje< menor) pdcaA3.pdcaa3_status = 0;
        else{
          pdcaA3.pdcaa3_status =(100 * (hoje.valueOf() - menor.valueOf())) / (maior.valueOf() - menor.valueOf());
          if(pdcaA3.pdcaa3_status>=100){
            if(!pdcaA3.pdcaa3_is_close){
              await this.notifyService.create(pdcaA3.pdcaa3_id,pdcaA3.registry.a3_registry_name);
            }
          } pdcaA3.pdcaa3_status= 100;
        }
        
        await this.pdcaA3Repository.save(pdcaA3);
      } 
    });
  }
  async findById(id:number){
    return await this.pdcaA3Repository
    .createQueryBuilder('pdcaA3')
    .where('pdcaA3.a3_registry_id = :id',{id})
    .getOne();
  }

  async create(createDto: CreatePdcaA3Dto) {
    const a = await this.pdcaA3Repository.create(createDto);
    a.pdcaa3_status = 0;
    a.pdcaa3_is_close = false;
    await this.pdcaA3Repository.save(a);
    const pdcaa3List = await this.pdcaA3Repository.find();
    let numOpened = 0;
    let numSolved = 0;
  
    pdcaa3List.forEach((pdcaa3) => {
      if (!pdcaa3.pdcaa3_canceled) {
        if (pdcaa3.pdcaa3_is_close) {
          numSolved++;
        } else {
          numOpened++;
        }
      }
    });
    a.pdcaa3_opened = numOpened;
    a.pdcaa3_solved = numSolved;
    await this.pdcaA3Repository.save(a);
    return a;
  }

  async newModified(id:number){
    const pdca = await this.pdcaA3Repository.findOne({where: {pdcaa3_id: id}});

    pdca.pdcaa3_last_modified = new Date();

    return this.pdcaA3Repository.save(pdca);
  }

  async getAll(PaginationFilter: FilterWorkstation, search: QueryPdcaDto, pageRequest:PageRequest) {
    const { sort } = PaginationFilter;
    const { search_name, order_type } = search;

    const query = this.pdcaA3Repository
      .createQueryBuilder('pdca')
      .leftJoinAndSelect('pdca.registry', 'registry')
      .leftJoinAndSelect('pdca.pdca','pdc')
      .leftJoinAndSelect('pdc.user', 'user')
      
    if (search_name) {
      query.andWhere(
        new Brackets((queryBuilderOne) => {
          queryBuilderOne.where('registry.a3_registry_name like :name', {
            name: `${search_name}%`,
          });
        }),
      );
    }

    if (order_type == 1) {
      
      query.orderBy('pdca.pdcaa3_id', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
    } else if (order_type == 2) {
      query.orderBy(
        'pdca.pdcaa3_last_modified',
        `${sort === 'DESC' ? 'DESC' : 'ASC'}`,
      );
    } else if (order_type == 3) {
      query.orderBy(
        'registry.a3_registry_name',
        `${sort === 'ASC' ? 'DESC' : 'ASC'}`,
      );
    } else if (order_type == 4) {
      query.orderBy('pdca.pdcaa3_status', `${sort === 'ASC' ? 'DESC' : 'ASC'}`);
    }
    const rawQuery = await query.getMany();

    const page = rawQuery.slice(pageRequest.page*pageRequest.size - pageRequest.size, pageRequest.page*pageRequest.size);
    const res = page.map( pdcaA3 =>{
      const dto = new pdcaA3ElementDto();
      dto.id = pdcaA3.pdcaa3_id;
      dto.registry_name = pdcaA3.registry.a3_registry_name;
      dto.action_number = pdcaA3.pdca.length;
      dto.status = pdcaA3.pdcaa3_status;
      dto.is_closed = pdcaA3.pdcaa3_is_close;
      dto.in_charge = '';

      pdcaA3.pdca.forEach( pdca => {
        dto.in_charge += pdca.user.users_name+'. ';
      })

      return dto;
    });
    return Page.from(res,rawQuery.length,pageRequest);
  }

  async getcauses(id:number,id_cause:number){
    const pdca = await this.pdcaA3Repository
    .createQueryBuilder('pdcaA3')
    .leftJoinAndSelect('pdcaA3.registry','registry')
    .leftJoinAndSelect('registry.a3_causes','cause')
    .where('pdcaA3.pdcaa3_id = :id',{id})
    .getOne();
    var flag = false;
    pdca.registry.a3_causes.forEach( cause =>{
      if(cause.a3_cause_id == id_cause) flag = true;
    })

    return flag;
  }
  async getById(id: number) {
    return await this.pdcaA3Repository
      .createQueryBuilder('pdcaA3')
      .leftJoinAndSelect('pdcaA3.pdca', 'pdca')
      .leftJoinAndSelect('pdca.cause', 'cause')
      .leftJoinAndSelect('pdcaA3.notifications', 'notifications')
      .leftJoinAndSelect('cause.soluctions', 'soluctions')
      .leftJoinAndSelect('cause.subcauses_soluctions', 'subcauses_soluctions')
      .leftJoinAndSelect('pdca.user', 'user')
      .leftJoinAndSelect('pdcaA3.registry', 'registry')
      .where('pdcaA3.pdcaa3_id = :id', { id })
      .getOne();
  }
  async finish(id: number) {
    const pdcaA3 = await this.getById(id);
    

    if (pdcaA3.pdcaa3_is_close == true) {
        throw new BadRequestException("Plano de ação já finalizado");
    }

    if (pdcaA3.pdca && pdcaA3.pdca.length > 0) {
        for (const pdcaItem of pdcaA3.pdca) {
            if (pdcaItem.cause) {
                if ((pdcaItem.cause.soluctions && pdcaItem.cause.soluctions.length == 0) && (pdcaItem.cause.subcauses_soluctions && pdcaItem.cause.subcauses_soluctions.length == 0)){                  
                   throw new BadRequestException("Plano de ação não pode ser finalizado (Itens pendentes)");
                }
            }
        }
    }
    pdcaA3.pdcaa3_is_close = true;
    await this.pdcaA3Repository.save(pdcaA3)

    pdcaA3.pdcaa3_solved += 1;
    pdcaA3.pdcaa3_opened -= 1;

    if (!pdcaA3.notifications) {
        throw new BadRequestException("Plano de ação concluído com atraso");
    }

    return pdcaA3;
}

  async canceled(id: number, UpdatePdcaA3Dto: UpdatePdcaA3Dto) {
    const pdcaA3 = await this.getById(id);

    if (!pdcaA3) throw new BadRequestException("Id Inválido");

    if (pdcaA3.pdcaa3_is_close == true) {
      throw new BadRequestException("Plano já finalizado");
    }
    if (pdcaA3.pdcaa3_canceled == true) {
      throw new BadRequestException("Plano de ação já cancelado!");
    } else {
        pdcaA3.pdcaa3_canceled = true;
    }

    pdcaA3.pdcaa3_justification = NameValidate.getInstance().getJustification(UpdatePdcaA3Dto.pdcaa3_justification);


    return await this.pdcaA3Repository.save(pdcaA3)
  }

  async delete(id: number) {
    const pdcaA3 = await this.getById(id);

    if (pdcaA3.pdcaa3_status > 0)
      throw new BadRequestException('Ação inválida, PDCA já iniciado!');

    if (!pdcaA3) throw new BadRequestException('id inválido!');

    await this.pdcaService.deleteAll(id);

    return this.pdcaA3Repository.remove(pdcaA3);
  }
}
