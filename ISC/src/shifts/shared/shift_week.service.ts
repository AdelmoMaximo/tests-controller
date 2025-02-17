import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {CreateShiftWeekDto} from "../dtos/create-shift_week.dto"
import { ShiftWeekEntity } from "../entities/shift_week.entity";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { UpdateShiftWeekDto } from "../dtos/update-shift_week.dto";
import { NameValidate } from "src/common/utils/name.validate";

@Injectable()
export class ShiftWeekService {
    constructor(
        @InjectRepository(ShiftWeekEntity)
        private readonly shiftWeekRepository: Repository<ShiftWeekEntity>,
    ) { }
    async getById(id: number) {
        return this.shiftWeekRepository.findOne({ where: { shifts_week_id: id } })
    }
    async getAllId(id:number){
        return this.shiftWeekRepository.find({where: {shifts_id: id}})
    }
    private date_format(date:string){
        let va = date.split('T')
        va[1] = va[1].replace('-06','-04')
        return va[0]+ 'T'+ va[1]
    }
    async createShiftWeek(createDto: CreateShiftWeekDto) {
        const newShiftWeek = this.shiftWeekRepository.create(createDto);

        let dateBegin = new Date(newShiftWeek.shifts_week_begin);
        let dateEnd = new Date(newShiftWeek.shifts_week_end);
    
        if(newShiftWeek.shifts_week_begin.toString().endsWith('Z')){
            dateBegin = new Date(dateBegin.toISOString().replace('Z',''));
            dateEnd = new Date(dateEnd.toISOString().replace('Z',''));
        
            newShiftWeek.shifts_week_begin = dateBegin;
            newShiftWeek.shifts_week_end = dateEnd;
        }
        let str1 =newShiftWeek.shifts_week_begin.toString()
        let str2 =newShiftWeek.shifts_week_end.toString()
        if(str1.charAt(str1.length -6)==='-'){
            str1 = this.date_format(str1)
            str2 = this.date_format(str2)
            console.log(str1)
           
            dateBegin = new Date(str1);
            dateEnd = new Date(str2);

            newShiftWeek.shifts_week_begin = dateBegin;
            newShiftWeek.shifts_week_end = dateEnd;
        }
       
        
        console.log(newShiftWeek.shifts_week_begin)
        newShiftWeek.shifts_week_description = NameValidate.getInstance().getValidDescription(newShiftWeek.shifts_week_description);

        console.log(dateEnd.valueOf()-dateBegin.valueOf())

        if(dateBegin>= dateEnd) throw new BadRequestException('Horários invalidos!')
        if(dateEnd.valueOf()-dateBegin.valueOf() < 21600000) throw new BadRequestException('Turno deve ter ao menos 6 horas de duração!')
        if(dateEnd.valueOf()-dateBegin.valueOf() > 36000000) throw new BadRequestException('Turno não pode exceder 10 horas de duração!')

        const days = await this.getAllId(createDto.shifts_id)

        if(days.length==7) throw new BadRequestException('Turno pode ter no máximo 7 dias!')

        const day = days.find(day =>{
            if(day.shifts_week_description== newShiftWeek.shifts_week_description) return day
        })

        if(day) throw new BadRequestException('dia já cadastrado!')
        return this.shiftWeekRepository.save(newShiftWeek);
    }
    async delete(id:number){
        const days = await this.shiftWeekRepository.createQueryBuilder('shifts')
        .where('shifts.shifts_id = :id',{id})
        .getMany();
        days.forEach(shiftWeek =>{
           this.shiftWeekRepository.remove(shiftWeek);
        })
    }
    async update(id:number,updateShiftDto:UpdateShiftWeekDto){
        const day =await this.getById(id)

        
        let dateBegin = new Date(updateShiftDto.shifts_week_begin)
        let dateEnd = new Date(updateShiftDto.shifts_week_end)

        if(updateShiftDto.shifts_week_begin.toString().endsWith('Z')){
            dateBegin = new Date(dateBegin.toISOString().replace('Z',''));
            dateEnd = new Date(dateEnd.toISOString().replace('Z',''));
        
        }

        if(dateBegin>= dateEnd) throw new BadRequestException('Horários invalidos!')
        if(dateEnd.valueOf()-dateBegin.valueOf() < 21600000) throw new BadRequestException('Turno deve ter ao menos 6 horas de duração!')
        if(dateEnd.valueOf()-dateBegin.valueOf() > 36000000) throw new BadRequestException('Turno não pode exceder 10 horas de duração!')

        day.shifts_week_begin = dateBegin
        day.shifts_week_end = dateEnd
        day.shifts_week_description = NameValidate.getInstance().getValidDescription(updateShiftDto.shifts_week_description);
        
        return this.shiftWeekRepository.save(day);
    }
    async remove(id:number){
        return this.shiftWeekRepository.delete(id);
    }
}
