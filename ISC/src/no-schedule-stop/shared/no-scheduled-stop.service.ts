import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException } from "src/common/exception-filters/bad-request.exception";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { Brackets, Repository } from "typeorm";
import { NoScheduleStopEntity } from "../entities/no-schedule-stop.entity";
import { CreateNoScheduledStopDto } from "../dtos/create-no-scheduled.dto";
import { NameValidate } from "src/common/utils/name.validate";
import { SearchNoScheduledDto } from "../dtos/search-no-scheduled.dto";
import { ShiftsService } from "src/shifts/shared/shifts.service";
import { UsersService } from "src/users/shared/users.service";
import { LineService } from "src/line/shared/line.service";
import { DeviceService } from "src/device/shared/device.service";
import { ModelService } from "src/models/shared/models.service";
import { Raw } from 'typeorm';




@Injectable()
export class NoScheduledStopService {
    constructor(
        @InjectRepository(NoScheduleStopEntity)
        private readonly noScheduledStopRepository: Repository<NoScheduleStopEntity>,
        private readonly shiftService: ShiftsService,
        private readonly userService: UsersService,
        private readonly lineService: LineService,
        private readonly DeviceService: DeviceService,
        private readonly modelService: ModelService
    ) { }

    async getAll(PaginationFilter:FilterWorkstation,search:SearchNoScheduledDto){
        const { sort } = PaginationFilter
        const {search_name} = search

        const query = this.noScheduledStopRepository.createQueryBuilder('noScheduled')
        .leftJoinAndSelect('noScheduled.shift','shift')
        .leftJoinAndSelect('noScheduled.line','line')
        .leftJoinAndSelect('noScheduled.user','user')
        .leftJoinAndSelect('noScheduled.device','device')
        .leftJoinAndSelect('noScheduled.models','models');
        
        if(search_name){
            query.andWhere(
                new Brackets(queryBuilderOne =>{
                    queryBuilderOne
                    .where('noScheduled.no_scheduled_stop_code like :code',{code: `${search_name}%`})
                    .orWhere('line.line_name like :lineName',{lineName: `${search_name}%`})
                })
            )
        }
        query.orderBy('noScheduled.no_scheduled_stop_code',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
        return paginate<NoScheduleStopEntity>(query,PaginationFilter);
    }
    private days = [ "sunday","monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    async create(createDto: CreateNoScheduledStopDto) {

        const shift = await this.shiftService.getById(createDto.shifts_id)
        if(!shift) throw new BadRequestException('Id de turno inválido!')
        const user = await this.userService.getById(createDto.users_id)
        if(!user) throw new BadRequestException('Id de usuário inválido!')
        const line = await this.lineService.getById(createDto.registration_line_id);
        if(!line) throw new BadRequestException('Id de linha inválido!')
        const device = await this.DeviceService.getByID(createDto.device_id)
        if(!device) throw new BadRequestException('Id de dispositivo inválido!')
        const models = await this.modelService.getById(createDto.models_id)
        if(!models) throw new BadRequestException('Id do modelo inválido!')

        const admin = await this.userService.getAdminUser2(createDto.users_id);
        if(!admin) throw new BadRequestException('Verifique se o usuário cadastrado possui permissão a funcionalidade ou está ativo no sistema');
        const veri = await this.userService.verInativeDelete(createDto.users_id);
        if(!veri) throw new BadRequestException('Usuário excluido ou inativo!')

       const day = new Date(createDto.no_scheduled_stop_date.toString().replace('Z',""));

        const date = new Date();
        const stop_date = new Date(createDto.no_scheduled_stop_date);

        if(stop_date > date) throw new BadRequestException('Selecionar somente a data do dia atual ou do passado!')

        NameValidate.getInstance().getValidStopType(createDto.no_scheduled_stop_type)
        NameValidate.getInstance().getValidReasonOfStop(createDto.no_scheduled_stop_reason)
        NameValidate.getInstance().getValidIdentifiedCause(createDto.no_scheduled_stop_cause)
        NameValidate.getInstance().getValidName(createDto.no_scheduled_stop_user)

        const noScheduledStop = await this.noScheduledStopRepository.create(createDto)
        noScheduledStop.no_scheduled_stop_create_date = new Date()
        noScheduledStop.no_scheduled_stop_date = new Date(createDto.no_scheduled_stop_date.toString().replace('Z',""))
        noScheduledStop.no_scheduled_stop_code = await this.codeGenerator(createDto.no_scheduled_stop_type);

        const initialTime = new Date(createDto.no_scheduled_stop_initial_time);
        const finalTime = new Date(createDto.no_scheduled_stop_final_time);

        if(initialTime > finalTime) throw new BadRequestException('Selecionar horario inicial anterior ao final!');

        const timeDifference = finalTime.getTime() - initialTime.getTime();
        if (timeDifference === 0) {
            throw new BadRequestException('O tempo de parada não pode ser zero!');
        }



        const existingStops = await this.noScheduledStopRepository.find({
            where: {
                no_scheduled_stop_date: createDto.no_scheduled_stop_date,
            }
        });
        
        for (const existingStop of existingStops) {
            const existingStartTime = new Date(existingStop.no_scheduled_stop_initial_time);
            const existingEndTime = new Date(existingStop.no_scheduled_stop_final_time);
            const newStartTime = new Date(createDto.no_scheduled_stop_initial_time);
            const newEndTime = new Date(createDto.no_scheduled_stop_final_time);
        
            if (
                (newStartTime.getHours() === existingStartTime.getHours() && newStartTime.getMinutes() === existingStartTime.getMinutes()) ||
                (newEndTime.getHours() === existingEndTime.getHours() && newEndTime.getMinutes() === existingEndTime.getMinutes()) ||
                (newStartTime.getHours() === existingStartTime.getHours() && newStartTime.getMinutes() > existingStartTime.getMinutes() && newStartTime.getMinutes() < existingEndTime.getMinutes()) ||
                (newEndTime.getHours() === existingEndTime.getHours() && newEndTime.getMinutes() > existingStartTime.getMinutes() && newEndTime.getMinutes() < existingEndTime.getMinutes()) ||
                (newStartTime.getHours() < existingStartTime.getHours() && newEndTime.getHours() > existingStartTime.getHours()) ||
                (newStartTime.getHours() < existingEndTime.getHours() && newEndTime.getHours() > existingEndTime.getHours())
            ) {
                throw new BadRequestException('Já existe uma parada registrada para o mesmo dia e horário.');
            }
        }

        
        const shiftDay = shift.shiftweek.find(element => element.shifts_week_description === this.days[day.getDay()]);

        if (!shiftDay) {
            throw new BadRequestException('Dia cadastrado não pertence ao turno!');
        }
        
        const shiftStartTime = new Date(shiftDay.shifts_week_begin);
        const shiftEndTime = new Date(shiftDay.shifts_week_end);
        
        if (
            initialTime.getHours() < shiftStartTime.getHours() || 
            initialTime.getHours() == shiftStartTime.getHours() && initialTime.getMinutes < shiftStartTime.getMinutes||
            finalTime.getHours() > shiftEndTime.getHours() ||
            finalTime.getHours() == shiftEndTime.getHours() && finalTime.getMinutes() > shiftEndTime.getMinutes() ||
            initialTime.getHours() > finalTime.getHours() ||
            initialTime.getHours() > finalTime.getHours() && initialTime.getMinutes() >= finalTime.getMinutes()
        ) {
            throw new BadRequestException('O horário inicial e final devem estar dentro do horário do turno cadastrado para o dia informado.');
        }
        
    

        const initialTimeMs = initialTime.getTime();
        const finalTimeMs = finalTime.getTime();
        
        const totalTimeMs = finalTimeMs - initialTimeMs;
        
        noScheduledStop.no_scheduled_stop_total_time = Number(totalTimeMs);
    
        return this.noScheduledStopRepository.save(noScheduledStop);
    }

    async codeGenerator(code:string){
        const query = await this.noScheduledStopRepository.createQueryBuilder('noScheduled')
        .where('noScheduled.no_scheduled_stop_type = :code',{code})
        .orderBy('noScheduled.no_scheduled_stop_id','DESC')
        .getOne();

        if(!query) return code+'000001';
        const stopCode = query.no_scheduled_stop_code.replace(code,'')

        let number = Number(stopCode)+1;
        let codigo = number.toString();
        const v = codigo.length
        for(var i=0;i<6-v;i++){
            codigo = '0'+codigo;
        }
        return code+codigo;
    }

    async getById(id: number) {
        return this.noScheduledStopRepository.createQueryBuilder('no')
            .leftJoinAndSelect('no.shift', 'shift')
            .leftJoinAndSelect('no.line', 'line')
            .leftJoinAndSelect('no.user', 'user')
            .leftJoinAndSelect('no.models', 'models')
            .leftJoinAndSelect('no.device', 'device')
            .where('no.no_scheduled_stop_id = :id', { id })
            .getOne();
    }

    async delete(id: number) {
        return this.noScheduledStopRepository.delete(id);
    }

}