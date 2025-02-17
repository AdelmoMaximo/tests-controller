import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { a3_notifyEntity } from '../entities/notify.entity';
import { PageRequest } from 'src/common/pagination/page-request.model';
import { NotifyElementDto } from '../dto/notify-element.dto';
import { Page } from 'src/common/pagination/page.model';

@Injectable()
export class NotifyService {
  @InjectRepository(a3_notifyEntity)
  private readonly notifyRepository: Repository<a3_notifyEntity>;

  async findAll(pageRequest:PageRequest) {
    const raw = await this.notifyRepository.find();
    const no_seen = await this.notifyRepository.find({where:{a3_notify_is_seen : false}});
    
    const page = raw.slice(pageRequest.page*pageRequest.size - pageRequest.size, pageRequest.page*pageRequest.size);
    const res = page.map( (notify,i) =>{
      const dto = new NotifyElementDto();
      dto.id = notify.a3_notify_id;
      dto.notify_message = notify.a3_notify_message;
      dto.notify_created_at = notify.a3_notify_created_at;
      dto.notify_is_seen = notify.a3_notify_is_seen;
      if(i==0){
        dto.no_seen_number = no_seen.length;
      }
      return dto;
    });
    return Page.from(res,raw.length,pageRequest);
  }

  async create(id:number,a3_name:string){
    const notify = this.notifyRepository.create();
    notify.pdcaa3_id= id;
    notify.a3_notify_message = 'PDCA '+a3_name+' está atrasado!, favor verificar!';
    notify.a3_notify_created_at = new Date();
    notify.a3_notify_is_seen = false;
    console.log('a');
    return this.notifyRepository.save(notify);
  }

  async updateStatus(id:number){
    const notify = await this.notifyRepository.findOne({where :{a3_notify_id : id}});

    notify.a3_notify_is_seen = true;

    return this.notifyRepository.save(notify);
  }
}
