import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdcaEntity } from '../entities/pdca.entity';
import { Repository } from 'typeorm';
import { CreatePdcaDto } from '../dto/create-pdca.dto';
import { NameValidate } from 'src/common/utils/name.validate';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { PdcaA3Service } from './pdcaA3.service';

@Injectable()
export class PdcaService {
  constructor(
    @InjectRepository(PdcaEntity)
    private readonly pdcaRepository: Repository<PdcaEntity>,
    private readonly pdcaA3Service: PdcaA3Service,
  ) {}

  async getAll(PaginationFilter: FilterWorkstation) {
    const { sort } = PaginationFilter;

    const query = this.pdcaRepository.createQueryBuilder('pdca');

    query.orderBy('pdca.pdca_id', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);

    return paginate<PdcaEntity>(query, PaginationFilter);
  }

  async getById(id: number) {
    return await this.pdcaRepository
      .createQueryBuilder('pdca')
      .leftJoinAndSelect('pdca.cause', 'cause')
      .leftJoinAndSelect('pdca.user', 'user')
      .where('pdca.pdca_id = :id', { id })
      .getOne();
  }

  private validateDuration(startDate: Date, endDate: Date) {
    const startDateInSeconds = Math.floor(startDate.valueOf() / 1000);
    const endDateInSeconds = Math.floor(endDate.valueOf() / 1000);

    const durationInSeconds = endDateInSeconds - startDateInSeconds;

    const minDurationInSeconds = 24 * 60 * 60;
    const maxDurationInSeconds = 31.536 * 10 ** 6;

    if (
      durationInSeconds < minDurationInSeconds ||
      durationInSeconds > maxDurationInSeconds
    ) {
      throw new BadRequestException('A duração deve ser entre 1 dia e 1 ano.');
    }
  }

  async create(createDto: CreatePdcaDto) {
    const pdca = await this.pdcaRepository.create(createDto);

    const verify = await this.pdcaA3Service.getcauses(
      pdca.pdcaa3_id,
      pdca.a3_cause_id,
    );

    if (!verify)
      throw new BadRequestException('Causa não relacionada ao registro!');

    pdca.pdca_last_modified = new Date();
    NameValidate.getInstance().getValidWhat(createDto.pdca_what);
    NameValidate.getInstance().getValidWhy(createDto.pdca_why);
    NameValidate.getInstance().getValidWhere(createDto.pdca_where);
    NameValidate.getInstance().getValidHow(createDto.pdca_how);
    NameValidate.getInstance().getHowMuch(createDto.pdca_how_much);

    const startDate = new Date(pdca.pdca_when);
    const endDate = new Date(pdca.pdca_when_end);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const startDateWithoutTime = new Date(startDate);
    startDateWithoutTime.setHours(0, 0, 0, 0);

    if (startDateWithoutTime < currentDate) {
      throw new BadRequestException(
        'Você não pode cadastrar uma data passada.',
      );
    }

    this.validateDuration(startDate, endDate);

    return this.pdcaRepository.save(pdca);
  }

  async update(id: number, updateDto: CreatePdcaDto) {
    const pdca = await this.pdcaRepository
      .createQueryBuilder('pdca')
      .leftJoinAndSelect('pdca.pdcaA3', 'pdcaA3')
      .where('pdca.pdca_id = :id', { id })
      .getOne();

    if (!pdca) {
      return await this.create(updateDto);
    } else {
      if (pdca.pdcaA3.pdcaa3_status === 100)
        throw new BadRequestException('Ação inválida!');

      pdca.pdca_last_modified = new Date();
      NameValidate.getInstance().getValidWhat(updateDto.pdca_what);
      NameValidate.getInstance().getValidWhy(updateDto.pdca_why);
      NameValidate.getInstance().getValidWhere(updateDto.pdca_where);
      NameValidate.getInstance().getValidHow(updateDto.pdca_how);
      NameValidate.getInstance().getHowMuch(updateDto.pdca_how_much);

      const startDate = new Date(updateDto.pdca_when);
      const endDate = new Date(updateDto.pdca_when_end);

      this.validateDuration(startDate, endDate);

      pdca.pdca_when = startDate;
      pdca.pdca_when_end = endDate;

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const startDateWithoutTime = new Date(startDate);
      startDateWithoutTime.setHours(0, 0, 0, 0);

      if (startDateWithoutTime < currentDate) {
        throw new BadRequestException(
          'Você não pode cadastrar uma data passada.',
        );
      }

      const a = this.pdcaRepository.merge(pdca, updateDto);

      a.a3_cause_id = pdca.a3_cause_id;
      a.pdcaa3_id = pdca.pdcaa3_id;

      await this.pdcaA3Service.newModified(pdca.pdcaA3.pdcaa3_id);
      return this.pdcaRepository.save(pdca);
    }
  }

  async delete(id: number) {
    const pdca = await this.getById(id);
    if (!pdca) throw new BadRequestException('id Inválido!');

    return this.pdcaRepository.delete(id);
  }

  async deleteAll(id: number) {
    const list = await this.pdcaRepository
      .createQueryBuilder('pdca')
      .where('pdca.pdcaa3_id = :id', { id })
      .getMany();

    list.forEach(async (pdca) => {
      await this.pdcaRepository.remove(pdca);
    });
    return;
  }
}
