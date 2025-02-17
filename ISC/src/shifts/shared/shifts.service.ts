import { NameValidate } from 'src/common/utils/name.validate';
import { UpdateShiftDto } from './../dtos/update-shift.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateShiftDto } from '../dtos/create-shift.dto';
import { ShiftEntity } from '../entities/shift.entity';
import { converteBooleanToBit } from 'src/common/utils/boolean.bit';
import { BadRequestException } from 'src/common/exception-filters/bad-request.exception';
import { SearchShiftDto } from '../dtos/search-shift.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { ShiftWeekService } from './shift_week.service';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(ShiftEntity)
        private readonly shiftRepository: Repository<ShiftEntity>,
        private readonly shiftWeekService: ShiftWeekService
    ){}

    async getAll(search:SearchShiftDto,PaginationFilter:FilterWorkstation){
        const { sort } = PaginationFilter
        const { search_name } = search

        const query = this.shiftRepository.createQueryBuilder('shift')
        query.where('shift.shifts_delete = 0');

        if(search_name){
            query
            .andWhere(new Brackets(queryBuilderOne => {
                queryBuilderOne
                .where('shift.shifts_name like :shiftName',{shiftName: `${search_name}%`})
                .orWhere('shift.shifts_acronym like :shiftAcronym',{shiftAcronym: `${search_name}%`})
        }));
        }
        query.orderBy('shift.shifts_acronym',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
        return paginate<ShiftEntity>(query,PaginationFilter);
    }
    async getOptions(){
        return this.shiftRepository.createQueryBuilder('shift')
        .where('shift.shifts_status = 1 AND shift.shifts_delete = 0')
        .leftJoinAndSelect('shift.shiftweek','shiftweek')
        .orderBy('shift.shifts_acronym', 'DESC')
        .getMany();
    }
    async getDays(id:number){
        const days = await this.getById(id);

        let a = [];

        days.shiftweek.forEach(element =>{
            a.push(element.shifts_week_description);
        })

        return a;
    }
    async getOne(id:number){
        return this.shiftRepository.find({where :{shifts_id:id}});
    }
    
    async create(shiftDto:CreateShiftDto){
        const acronymExists = await this.getByAcronym(shiftDto.shifts_acronym);

        if(acronymExists){
            throw new BadRequestException("Sigla já existe!");
        }

        const shift = this.shiftRepository.create(shiftDto);

        shift.shifts_delete = false;
        shift.shifts_create_date = new Date();
        shift.shifts_status = !converteBooleanToBit(shiftDto.shifts_status);
        shift.shifts_acronym = NameValidate.getInstance().getValidShifAcronym(shiftDto.shifts_acronym);
        shift.shifts_name = NameValidate.getInstance().getValidShiftName(shiftDto.shifts_name);

        return this.shiftRepository.save(shift);
    }
    async getById(id:number){
        return this.shiftRepository.createQueryBuilder('shift')
        .leftJoinAndSelect('shift.shiftweek','shiftweek')
        .leftJoinAndSelect('shift.schedule_stop','scheduled')
        .leftJoinAndSelect('shift.no_schedule_stop','no_scheduled')
        .where('shift.shifts_id = :id AND shift.shifts_delete = 0',{id})
        .getOne();
    }
    private days = [ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday" ];
    async returnById(id:number){
        const a = await this.shiftRepository.createQueryBuilder('shift')
        .leftJoinAndSelect('shift.shiftweek','shiftweek')
        .where('shift.shifts_id = :id AND shift.shifts_delete = 0',{id})
        .getOne();
        console.log(a);
        const count = a.shiftweek.length;
        let i =0;
        while(i<7){
            a.shiftweek.forEach(week =>{
                if(week.shifts_week_description === this.days[i]){
                    a.shiftweek.push(week);
                } 
            })
            i++;
        }
        i=0;
        while(i<count){
            a.shiftweek.shift();
            i++;
        }
        return a;
    }

    async getByAcronym(acronym:string){
        return this.shiftRepository.findOne({where:{shifts_acronym:acronym, shifts_delete: false}});
    }

    async update(id:number,shiftDto:UpdateShiftDto){    
        const  shift = await this.getById(id);
        shift.shifts_update_data = new Date();
        shift.shifts_update_user = shiftDto.shifts_update_user;
        shift.shifts_acronym = NameValidate.getInstance().getValidShifAcronym(shiftDto.shifts_acronym);
        shift.shifts_name = NameValidate.getInstance().getValidShiftName(shiftDto.shifts_name);
        
        const acronymExists = await this.shiftRepository.findOne({where:{shifts_acronym:shiftDto.shifts_acronym,shifts_delete:false}});

        if(acronymExists && acronymExists.shifts_id != id){
            throw new BadRequestException("Sigla já existe!");
        }

        return this.shiftRepository.save(shift);    

    }

    async remove (id:number){
        //await this.shiftWeekService.delete(id);
        const shift = await this.getById(id)
        
        if(shift.schedule_stop.length!=0 || shift.no_schedule_stop.length !=0) throw new BadRequestException("Turno linkado a parada!")

        if(shift.shifts_delete) throw new BadRequestException("Turno ja excluido!")
        shift.shifts_delete = true;
        return this.shiftRepository.save(shift);
    }
    
}