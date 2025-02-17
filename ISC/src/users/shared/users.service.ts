import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { use } from 'passport';
import { BadRequestException } from 'src/common/exception-filters/bad-request.exception';
import { converteBooleanToBit } from 'src/common/utils/boolean.bit';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { hash, isMatchHash } from 'src/common/utils/hash';
import { NameValidate } from 'src/common/utils/name.validate';
import { Brackets, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { QueryUserDto } from '../dtos/query-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ){}

  async getAll(PaginationFilter:FilterWorkstation,search:QueryUserDto){
    const {sort} = PaginationFilter
    const {search_type, order_type, search_name} = search


    const query = this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile','profile')

    query.where('user.users_delete = 0');

    if(search_type ==1){
      query.andWhere('user.users_status = 0')
      query.andWhere('user.users_justify != 3')
    }
    else if(search_type ==2){
      query.andWhere('user.users_status = 1')
      query.andWhere('user.count_tries > 0')
    }
    else if(search_type ==3){
      query.andWhere('user.count_tries = 0')
      query.andWhere('user.users_justify != 3')
    }
    if (search_name) {
      query
      .andWhere(new Brackets(queryBuilderOne => {
        queryBuilderOne
          .where('user.users_login like :user_login',{user_login: `${search_name}%`})
          .orWhere('user.users_name like :user_name',{user_name: `${search_name}%`})
          .orWhere('profile.profile_name like :user_profile',{user_profile: `${search_name}%`})
      }));
    }

    if(order_type == 1){
      query.orderBy('user.users_name',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
    }
    else if(order_type == 2){
      query.orderBy('user.users_login',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
    }
    else if(order_type == 3){
      query.orderBy('user.users_email',`${sort === 'DESC' ? 'DESC': 'ASC'}`);
    }
    return paginate<UserEntity>(query,PaginationFilter);
  }

  async getByEmail(email:string){
    return this.userRepository.findOne({where: {users_email:email}})
  }

  async getA3Users(){
    return this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile','profile')
    .leftJoinAndSelect('profile.transactions','transactions')
    .where('(transactions.transactions_cod = 2050 OR transactions.transactions_cod = 2051) AND user.users_delete = 0')
    .andWhere('user.users_status = 1')
    .getMany();
  }

  async getByLogin(login:string){
    return this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile','profile')
    .leftJoinAndSelect('profile.transactions','transactions')
    .where('user.users_login = :login and user.users_delete = 0',{login})
    .getOne();
  }
  async getOptions(){
    return this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile','profile')
    .leftJoinAndSelect('profile.transactions','transactions')
    .where('(transactions.transactions_cod = 1750 OR transactions.transactions_cod = 1751) AND user.users_delete = 0')
    .andWhere('user.users_status = 1')
    .getMany();
  }
  async getOptions2(){
    return this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile','profile')
    .leftJoinAndSelect('profile.transactions','transactions')
    .where('(transactions.transactions_cod = 1850 OR transactions.transactions_cod = 1851) AND user.users_delete = 0')
    .andWhere('user.users_status = 1')
    .getMany();
  }
  async getAdminUser(id:number){
    return this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile','profile')
    .leftJoinAndSelect('profile.transactions','transactions')
    .where('user.users_id = :id AND transactions.transactions_cod = 1750 AND user.users_delete = 0 AND user.users_status = 1',{id})
    .orWhere('user.users_id = :id AND transactions.transactions_cod = 1751 AND user.users_delete = 0 AND user.users_status = 1',{id})
    .getOne();
  }
  async getAdminUser2(id:number){
    return this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile','profile')
    .leftJoinAndSelect('profile.transactions','transactions')
    .where('user.users_id = :id AND transactions.transactions_cod = 1850 AND user.users_delete = 0 AND user.users_status = 1',{id})
    .orWhere('user.users_id = :id AND transactions.transactions_cod = 1851 AND user.users_delete = 0 AND user.users_status = 1',{id})
    .getOne();
  }
  async getByProfile(id:number){
    return this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile','profile')
    .leftJoinAndSelect('profile.transactions','transactions')
    .where('profile.profile_id = :id',{id})
    .getOne();
  }

  async getById(id:number){
    return this.userRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile','profile')
    .leftJoinAndSelect('profile.transactions','transactions')
    .where('user.users_id = :id',{id})
    .getOne();
  }

  async changeStatus(id:number,justify:number){
    const user = await this.getById(id);
    if(!user) throw new BadRequestException('Usuário inexistente!')
    if(user.users_delete) throw new BadRequestException('Usuário excluido não pode ser reativado !')
    if(!user.users_status) throw new BadRequestException('Usuário já inativado!')
    user.users_status = false;
    if(justify<1 || justify>3) throw new BadRequestException('Justificativa invalída!')
    user.users_justify = justify;
    user.count_tries = 3;
    return this.userRepository.save(user);
  }

  async decreaseTries(id:number){
    const user = await this.getById(id);
    user.count_tries --;

    if(user.count_tries == 0){
      user.users_justify = 0;
    }
    
    await this.userRepository.save(user);
  }

  async unlockUser(id:number){
    const user = await this.getById(id);
    if(!user) throw new BadRequestException('Usuário inexistente!')
    if(user.users_justify == 3) throw new BadRequestException('Usuário desabilitado não pode ser ativado!')
    if(user.users_status) throw new BadRequestException('usuário já ativado!')
    const date = new Date();
    const new_pass = 'Isc@'+('0'+(date.getMonth()+1)).slice(-2) + date.getFullYear()
    console.log(new_pass)
    user.users_password = await hash(new_pass);
    user.users_status = true;
    user.count_tries = 3;

    await this.userRepository.save(user);
  }
  async unlock(id:number){
    const user = await this.getById(id);
    user.count_tries =3;
    await this.userRepository.save(user);
  }

  async create(userDto:CreateUserDto){

    const user = this.userRepository.create(userDto);
    
    user.count_tries = 3;
    user.users_create_date = new Date();
    user.users_name = NameValidate.getInstance().getValidName(user.users_name);
    user.users_password = NameValidate.getInstance().getValidPassword(user.users_password);
    user.users_email = NameValidate.getInstance().getValidEmail(user.users_email);
    user.users_status =!!converteBooleanToBit(user.users_status);
    user.users_login = NameValidate.getInstance().getValidLogin(user.users_login);
    user.users_update_data = user.users_create_date;
    user.users_delete = false;

    const login = await this.getByLogin(user.users_login);

    if(login){
      throw new BadRequestException('Login já cadastrado!')
    }
    user.users_password = await hash(user.users_password)
    
    return this.userRepository.save(user);
  }

  async update(id:number,updateDto:UpdateUserDto){
    const user = await this.getById(id);
    
    user.users_name = NameValidate.getInstance().getValidName(updateDto.users_name);
    user.users_email = NameValidate.getInstance().getValidEmail(updateDto.users_email);
    user.profile_id = updateDto.profile_id;
    user.profile = updateDto.profile;
    user.users_update_data = new Date();
    if(updateDto.count_tries > 3 || updateDto.count_tries<0) throw new BadRequestException('Número de count tries inválido!')
    user.count_tries = updateDto.count_tries;
    user.users_status = updateDto.users_status;
    user.user_update_user = updateDto.user_update_user;
    const login = await this.getByLogin(updateDto.users_login);

    if(login && login.users_id != id){
      throw new BadRequestException('Login já cadastrado!')
    }
    if(updateDto.users_password){
      user.users_password = NameValidate.getInstance().getValidPassword(updateDto.users_password);
      user.users_password = await hash(updateDto.users_password)
    }
    user.users_login = NameValidate.getInstance().getValidLogin(updateDto.users_login);
    if(user.count_tries === 0){
      throw new BadRequestException('Usuário bloqueado não pode ser editado!')
    }

    if (updateDto.users_status === false) {
      throw new HttpException(
        'Não é possível atualizar usuário inativo',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.userRepository.save(user);   
  }

  async updateRefreshToken(id:number,refresh_token:string){
    return this.userRepository.createQueryBuilder()
        .update(UserEntity)
        .set({users_token:refresh_token})
        .where("users_id = :id",{id})
        .execute();
  }

  async verInativeDelete(userId: number): Promise<boolean> {
    const user = await this.getById(userId);
    if (!user) {
      throw new BadRequestException('Usuário inativo ou excluído!');
    }
    return !user.users_status || !user.users_delete;
  }

  async remove (id:number){
    const user = await this.getById(id);
    if(user.users_token){
      throw new BadRequestException('Usuário atualmente logado no sistema!')
    }
    if(user.users_delete) throw new BadRequestException('Usuário já excluído!')
    user.users_delete = true;
    return this.userRepository.save(user);
  }
  async validatePass(id:number,password:string){
    const user = await this.getById(id);
    const hashPassword = await isMatchHash(password,user.users_password);
    if(!hashPassword) throw new BadRequestException("Senha atual inválida!");
    return password;
  }
  async newPass(id:number,password:string){
    const user = await this.getById(id);
    user.users_password = NameValidate.getInstance().getValidPassword(password);
    user.users_password = await hash(password);
    return this.userRepository.save(user);
  }
}
