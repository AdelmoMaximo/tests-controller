import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Permission from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { QueryUserDto } from '../dtos/query-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersService } from '../shared/users.service';
import { validadePass } from '../dtos/validate-pass.dto';
import { ChangePasswordDto } from '../dtos/change-pass.dto';
import { BadRequestException } from 'src/common/exception-filters/bad-request.exception';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService:UsersService
    ){}

    @Post()
    @UseGuards(PermissionGuard(Permission.User.CREATE))
    async create(@Body() user: CreateUserDto) {
        return this.userService.create(user);
    }
    @Get('/getOptions/')
    async getOptions(){
        return this.userService.getOptions();
    }
    @Get('/validatePass/')
    @UseGuards(PermissionGuard(Permission.User.UPDATE))
    async validadePass(
        @Query() validPassword : validadePass
    ){
        return this.userService.validatePass(validPassword.id,validPassword.password);
    }
    @Patch('/changePass/')
    @UseGuards(PermissionGuard(Permission.User.UPDATE))
    async changePass(
        @Query() changeDto : ChangePasswordDto
    ){
        if(changeDto.new_password != changeDto.confirm_new_password) throw new BadRequestException('senhas não são iguais!')
        return this.userService.newPass(changeDto.id,changeDto.new_password);
    }
    @Get('/getOptions2/')
    async getOptions2(){
        return this.userService.getOptions2();
    }
    @Get('/getA3users/')
    async getA3Users(){
        return this.userService.getA3Users();
    }
    @Get("/login/:login")
    @UseGuards(PermissionGuard(Permission.User.FIND_ALL))
    async getByLogin(@Param('login') login: string) {
        return this.userService.getByLogin(login);
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.User.FIND_BY_ID))
    async getOne(
        @Param('id') id:number,
    ){
        return this.userService.getById(id);
    }
    
    @Get()
    @UseGuards(PermissionGuard(Permission.User.FIND_ALL))
    async getAll(
        @Query() searchType: QueryUserDto,
        @Query() paginationFilter:FilterWorkstation
    ){
        return this.userService.getAll(paginationFilter,searchType);
    }

    @Put(':id')
    @UseGuards(PermissionGuard(Permission.User.UPDATE))
    async updateUser(
        @Param('id') id:number,
        @Body() updateDto:UpdateUserDto
    ){
        return this.userService.update(id,updateDto);
    }
    
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.User.REMOVE))
    async deleteUser(
        @Param('id') id:number
    ){
        return this.userService.remove(id);
    }
    @Patch(':id')
    @UseGuards(PermissionGuard(Permission.User.UNLOCK))
    async unlockUser(
        @Param('id') id:number
    ){
        return this.userService.unlockUser(id);
    }
    @Patch(':id/status-change')
    @UseGuards(PermissionGuard(Permission.User.CHANGE_STATUS))
    async changeStatus(
        @Param('id') id:number,
        @Body() justify: PatchUserDto,
    ){
        return this.userService.changeStatus(id,justify.justify);
    }
}
