import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { DeviceEntity } from '../entities/device.entity';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { NameValidate } from 'src/common/utils/name.validate';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { SearchDeviceDto } from '../dto/search-device.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { UpdateDeviceDto } from '../dto/update-device.dto';
import { LineService } from 'src/line/shared/line.service';
import { PatchDeviceDto } from '../dto/patch-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly lineService: LineService
  ) { }

  async getAll(PaginationFilter: FilterWorkstation, search: SearchDeviceDto) {

    const { sort } = PaginationFilter
    const { order_type, search_name } = search

    const query = this.deviceRepository.createQueryBuilder('device');
    query
      .leftJoinAndSelect('device.phase_line', 'phase_line')

    if (search_name) {
      query
        .andWhere(new Brackets(queryBuilderOne => {
          queryBuilderOne
            .where('device.device_name like :name', { name: `${search_name}%` })
            .orWhere('phase_line.phase_line like :phaseLine', { phaseLine: `${search_name}%` })

        }));
    }

    if (order_type) {
      query.andWhere('device.device_status like :status', { status: `${order_type}%` })
    }

    query.orderBy('device.device_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
    return paginate<DeviceEntity>(query, PaginationFilter);

  }

  async getOptions() {
    return this.deviceRepository.createQueryBuilder('device')
      .orderBy('device.device_name', 'ASC')
      .getMany();
  }

  async getByID(id: number) {

    return this.deviceRepository.createQueryBuilder('device')
      .leftJoinAndSelect('device.phase_line', 'phase_line')
      .where('device.device_id = :id', { id })
      .getOne();
  }

  async getByName(name: string) {
    return this.deviceRepository.createQueryBuilder('device')
      .where('device.device_name = :name', { name })
      .getOne()
  }

  async create(deviceDto: CreateDeviceDto) {

  const newDevice = this.deviceRepository.create(deviceDto);

  NameValidate.getInstance().getValidDevice(deviceDto.device_name)
  NameValidate.getInstance().getValidName(deviceDto.device_create_user)
  newDevice.device_status = true
  newDevice.device_create_date = new Date();

  const deviceExists = await this.getByName(newDevice.device_name);

  if (deviceExists) {
    throw new BadRequestException(`Já existe Dispositivo com mesmo nome cadastrado!`);
  }

  return this.deviceRepository.save(newDevice);
}

  async update(id: number, updateDto: UpdateDeviceDto) {

  const updateDevice = await this.getByID(id);

  if (!updateDevice) {
    throw new BadRequestException("Id invalido!")
  }

  updateDevice.device_name = NameValidate.getInstance().getValidDevice(updateDto.device_name)
  updateDevice.device_update_user = NameValidate.getInstance().getValidName(updateDto.device_update_user)
  updateDevice.device_status = updateDto.device_status;
  updateDevice.phase_line = await this.lineService.getById(updateDto.registration_line_id);
  updateDevice.device_update_date = new Date();

  const deviceExists = await this.getByName(updateDevice.device_name);

  if (deviceExists && deviceExists.device_id != id) {
    throw new BadRequestException('Já existe Dispositivo com mesmo nome cadastrado!')
  }

  return this.deviceRepository.save(updateDevice);
}

async edit(id: number, patch: PatchDeviceDto) {
  const device = await this.getByID(id);
  device.device_status = Boolean(patch.device_status);
  return await this.deviceRepository.save(device);
}

  async delete (id: number) {

  const result = await this.getByID(id);

  if (!result) {

    throw new NotFoundException(`Dispositvo com id ${id} não encontrado!`);

  }

  return this.deviceRepository.delete(id);

}

}
