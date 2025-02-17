import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { Brackets, Repository } from "typeorm";
import { NameValidate } from "src/common/utils/name.validate";
import { ModelsComponentService } from "src/models/shared/models-component.service";
import { Cron } from "@nestjs/schedule";
import { ScheduleStopEntity } from "../entities/schedule-stop.entity";
import { SearchDto } from "src/common/utils/search.dto";
import { CreateScheduledStopDto } from "../dtos/create-stop.dto";
import { SearchStopDto } from "../dtos/search-stop.dto";
import { ShiftsService } from "src/shifts/shared/shifts.service";
import { UsersService } from "src/users/shared/users.service";
import { LineService } from "src/line/shared/line.service";
import { UpdateScheduledStopDto } from "../dtos/update-stop.dto";
import { FinalizeScheduledStopDto } from "../dtos/finalize-stop.dto";
import { PatchStopDto } from "../dtos/patch-schedule.dto";

@Injectable()
export class ScheduledStopService{
    constructor(
        @InjectRepository(ScheduleStopEntity)
        private readonly scheduledStopRepository: Repository<ScheduleStopEntity>,
        private readonly shiftService: ShiftsService,
        private readonly userService: UsersService,
        private readonly lineService: LineService
    ){}
    @Cron('30 * * * * *')
    async handleCron (){
        const date = new Date();
        const month = (date.getMonth()+1).toString().length == 1 ? '0'+ (date.getMonth()+1).toString() : (date.getMonth()+1).toString(); 
        const day = date.getDate().toString().length ==1  ? '0'+date.getDate().toString() : date.getDate().toString();
        const today = date.getFullYear().toString()+'-'+month+'-'+day;
  
        const list = await this.scheduledStopRepository.createQueryBuilder('scheduled')
        .where('scheduled.scheduled_stop_status = 1')
        .andWhere('scheduled.scheduled_stop_date = :data',{data: today})
        .getMany();

        list.forEach( async (stop) => {
            stop.scheduled_stop_status = 2;
            await this.scheduledStopRepository.save(stop);
        })
    }

    @Cron('00 * * * * *')
    async toSuspend(){
        const date = new Date();
        const month = (date.getMonth()+1).toString().length == 1 ? '0'+ (date.getMonth()+1).toString() : (date.getMonth()+1).toString(); 
        const day = date.getDate().toString().length ==1  ? '0'+date.getDate().toString() : date.getDate().toString();
        const today = date.getFullYear().toString()+'-'+month+'-'+day;

        const list = await this.scheduledStopRepository.createQueryBuilder('scheduled')
        .where('scheduled.scheduled_stop_status = 2')
        .andWhere('scheduled.scheduled_stop_date < :data',{data: today})
        .getMany();

        list.forEach( async (stop) => {
            stop.scheduled_stop_status = 5;
            await this.scheduledStopRepository.save(stop);
        })
    }


    async getAll(PaginationFilter:FilterWorkstation,search:SearchStopDto){
        const { sort } = PaginationFilter
        const {search_name, search_type} = search

        const query = this.scheduledStopRepository.createQueryBuilder('scheduled')
        .leftJoinAndSelect('scheduled.shift','shift')
        .leftJoinAndSelect('scheduled.line','line')
        .leftJoinAndSelect('scheduled.user','user');
        
        if(search_type){
            if(search_type==2){
                query.where('scheduled.scheduled_stop_status = :search_type and scheduled.scheduled_stop_is_actvie = 1',{search_type})
                query.orWhere('scheduled.scheduled_stop_status = 5 and scheduled.scheduled_stop_is_actvie = 1')
                
            }
            else{
                query.andWhere('scheduled.scheduled_stop_status = :search_type and scheduled.scheduled_stop_is_actvie = 1',{search_type})
            }
        }
        if(search_name){
            query.andWhere(
                new Brackets(queryBuilderOne =>{
                    queryBuilderOne
                    .where('scheduled.scheduled_stop_code like :code',{code: `${search_name}%`})
                    .orWhere('line.line_name like :lineName',{lineName: `${search_name}%`})
                })
            )
        }
        query.orderBy('scheduled.scheduled_stop_code',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
        return paginate<ScheduleStopEntity>(query,PaginationFilter);
    }
    private days = [ "sunday","monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    async create(createDto:CreateScheduledStopDto){
        const shift = await this.shiftService.getById(createDto.scheduled_stop_shifts_id)
        if(!shift) throw new BadRequestException('Id de turno inválido!')
        const user = await this.userService.getById(createDto.scheduled_stop_users_id)
        if(!user) throw new BadRequestException('Id de usuário inválido!')
        const line = await this.lineService.getById(createDto.scheduled_stop_registration_line_id);

        const admin = await this.userService.getAdminUser(createDto.scheduled_stop_users_id);
        if(!admin) throw new BadRequestException('Usuário deve ter permissão de admin ou editor para ser responsável!');

        const day = new Date(createDto.scheduled_stop_date.toString().replace('Z',""));
        console.log(day.getDay())

        let flag = true;

        shift.shiftweek.forEach( element =>{
            if(element.shifts_week_description === this.days[day.getDay()]) flag =false;
        })

        if(flag) throw new BadRequestException("Dia cadastrado nao pertence a turno!")

        const date = new Date();
        const stop_date = new Date(createDto.scheduled_stop_date);

        date.setHours(0,0,0,0);
        if(stop_date< date) throw new BadRequestException('Data não pode ser retroativa!');

        const time = new Date(createDto.scheduled_stop_estimated_time.toString().replace('Z',""));

        console.log(time.getHours());
      
        if(time.getHours() == 0 && time.getMinutes() ==0) throw new BadRequestException("Tempo de parada não pode ser nulo!")
        if((time.getHours() == 10 && time.getMinutes() >=1) || (time.getHours()>10)) throw new BadRequestException("Tempo de parada não pode exceder 10 horas!")

        NameValidate.getInstance().getValidScheduledDescription(createDto.scheduled_stop_description);
        NameValidate.getInstance().getValidScheduledCode(createDto.scheduled_stop_type);

        const scheduledStop = await this.scheduledStopRepository.create(createDto)
        scheduledStop.scheduled_stop_code = await this.codeGenerator(createDto.scheduled_stop_type);
        scheduledStop.scheduled_stop_status = 1;
        scheduledStop.scheduled_stop_date_created = new Date();
        scheduledStop.scheduled_stop_date =day;
        scheduledStop.scheduled_stop_estimated_time = time;
        return this.scheduledStopRepository.save(scheduledStop);
    }
    async codeGenerator(code:string){
        const query = await this.scheduledStopRepository.createQueryBuilder('scheduled')
        .where('scheduled.scheduled_stop_type = :code',{code})
        .orderBy('scheduled.scheduled_stop_id','DESC')
        .getOne();

        if(!query) return code+'000001';
        const stopCode = query.scheduled_stop_code.replace(code,'')

        let number = Number(stopCode)+1;
        let codigo = number.toString();
        const v = codigo.length
        for(var i=0;i<6-v;i++){
            codigo = '0'+codigo;
        }
        return code+codigo;
    }
    async getById(id:number){
        return this.scheduledStopRepository.createQueryBuilder('stop')
        .leftJoinAndSelect('stop.shift','shift')
        .leftJoinAndSelect('stop.line','line')
        .leftJoinAndSelect('stop.user','user')
        .where('stop.scheduled_stop_id = :id',{id})
        .getOne();
    }
    async finalizeId(id:number,dto:FinalizeScheduledStopDto){
        const stop = await this.getById(id)
        NameValidate.getInstance().getCause(dto.scheduled_stop_causa_identificada);
        NameValidate.getInstance().getAction(dto.scheduled_stop_acao_executada)
        if(stop.scheduled_stop_status ==4) throw new BadRequestException('Parada já finalizada!');

        const time = new Date(dto.scheduled_stop_tempo_real.toString().replace('Z',''));

        if(time.getHours() == 0 && time.getMinutes() ==0) throw new BadRequestException("Tempo de parada não pode ser nulo!")
        if((time.getHours() == 10 && time.getMinutes() >=1) || (time.getHours()>10)) throw new BadRequestException("Tempo de parada não pode exceder 10 horas!")
        dto.scheduled_stop_tempo_real = time;

        const admin = await this.userService.getAdminUser(dto.scheduled_stop_users_id);
        if(!admin) throw new BadRequestException('Verifique se o usuário cadastrado possui permissão a funcionalidade ou está ativo no sistema');

        stop.scheduled_stop_status = 4;
        return this.scheduledStopRepository.save({
            ...stop,
            ...dto
        })
    }
    async suspendId(id: number, justify: string) {
        const stop = await this.getById(id);
        if(stop.scheduled_stop_status == 3) throw new BadRequestException('Parada já suspensa!')
        const trimmedJustify = NameValidate.getInstance().getJustify(justify);
    
        if (trimmedJustify === undefined) {
            console.log("A justificativa é inválida.");
            return;
        }
    
        stop.scheduled_stop_status = 3;
        stop.scheduled_stop_justify = trimmedJustify;
        return this.scheduledStopRepository.save(stop);
    }
    
    async getOptions(){
        return this.scheduledStopRepository.createQueryBuilder('component')
        .orderBy('component.component_descrition', 'DESC')
        .getMany();
    }
    async getByName(name:string){
        return this.scheduledStopRepository.createQueryBuilder('component')
        .where('component.component_descrition = :name',{name})
        .getOne();
    }
    async edit(id:number,updateDto:UpdateScheduledStopDto){
        const scheduled = await this.getById(id)

        if(!scheduled) throw new BadRequestException("Id invalido!")
        if(scheduled.scheduled_stop_status > 2) throw new BadRequestException("Esta Parada não pode ser editada!")
        NameValidate.getInstance().getValidScheduledDescription(updateDto.scheduled_stop_description);
        NameValidate.getInstance().getValidScheduledCode(updateDto.scheduled_stop_type);
        if(scheduled.scheduled_stop_type != updateDto.scheduled_stop_type){
            scheduled.scheduled_stop_code = await this.codeGenerator(updateDto.scheduled_stop_type);
        }

        scheduled.scheduled_stop_users_update_data = new Date();

        scheduled.scheduled_stop_shifts_id = updateDto.scheduled_stop_shifts_id;
        scheduled.shift = await this.shiftService.getById(updateDto.scheduled_stop_shifts_id);
        scheduled.scheduled_stop_registration_line_id = updateDto.scheduled_stop_registration_line_id;
        scheduled.line = await this.lineService.getById(updateDto.scheduled_stop_registration_line_id);
        scheduled.scheduled_stop_users_id = updateDto.scheduled_stop_users_id;
        scheduled.user = await this.userService.getById(updateDto.scheduled_stop_users_id);

        const admin = await this.userService.getAdminUser(updateDto.scheduled_stop_users_id);
        if(!admin) throw new BadRequestException('Usuário deve ter permissão de admin ou editor para ser responsável!');

        scheduled.scheduled_stop_date = new Date (updateDto.scheduled_stop_date.toString().replace('Z',""));

        const day = new Date(updateDto.scheduled_stop_date.toString().replace('Z',""));

        const shift = await this.shiftService.getById(updateDto.scheduled_stop_shifts_id);

        let flag = true;

        shift.shiftweek.forEach( element =>{
            if(element.shifts_week_description === this.days[day.getDay()]) flag =false;
        })

        if(flag) throw new BadRequestException("Dia cadastrado nao pertence a turno!")
       

        const date = new Date();

        date.setHours(0,0,0,0);
        if(scheduled.scheduled_stop_date <date) throw new BadRequestException("Data não pode ser retroativa!")

        const time = new Date(updateDto.scheduled_stop_estimated_time.toString().replace('Z',''));
      
        if(time.getHours() == 0 && time.getMinutes() ==0) throw new BadRequestException("Tempo de parada não pode ser nulo!")
        if((time.getHours() == 10 && time.getMinutes() >=1) || (time.getHours()>10)) throw new BadRequestException("Tempo de parada não pode exceder 10 horas!")

        updateDto.scheduled_stop_estimated_time = time;
        updateDto.scheduled_stop_date = new Date (updateDto.scheduled_stop_date.toString().replace('Z',""));

        const newScheduled = await this.scheduledStopRepository.save({...scheduled,...updateDto});

        return newScheduled
    }
    async delete(id:number){
        const stop = await this.getById(id);
        stop.scheduled_stop_is_actvie = false;
        return this.scheduledStopRepository.save(stop);
    }
    
}