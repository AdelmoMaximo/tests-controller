import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import Permission from "src/auth/enums/permission.type";
import { PermissionGuard } from "src/auth/shared/guards/permission.guard";
import { PublicRoute } from "src/common/decorators/public-route.decorator";
import { FilterWorkstation } from "src/common/utils/filterwork.dto";
import { CreateProfileDto } from "../dtos/create-profile.dto";
import { SearchProfileDto } from "../dtos/search-profile.dto";
import { UpdateProfileDto } from "../dtos/update-profile.dto";
import { ProfileService } from "../shared/profile.service";

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController{
    constructor(
        private readonly profileService:ProfileService
    ){}
    @Post()
    @UseGuards(PermissionGuard(Permission.Profile.CREATE))
    async createProfile(
        @Body() createDto:CreateProfileDto
    ){
        return this.profileService.createProfile(createDto);
    }
    @Get()
    @UseGuards(PermissionGuard(Permission.Profile.FIND_ALL))
    async getAll(
        @Query() searchType: SearchProfileDto,
        @Query() paginationFilter:FilterWorkstation
    ){
        return this.profileService.getAll(paginationFilter,searchType);
    }
    @Get('/exist/:name')
    @UseGuards(PermissionGuard(Permission.Profile.FIND_ALL))
    async getExist(
        @Param('name') search_name:string,
    ){
        return this.profileService.getByName(search_name);
    }
    @Get('/getOptions/')
    @PublicRoute()
    async getOptions(){
        return this.profileService.getOptions();
    }
    @Get(':id')
    @UseGuards(PermissionGuard(Permission.Profile.FIND_BY_ID))
    async getOne(
        @Param('id') id:number
    ){
        return this.profileService.getById(id);
    }
    @Put(':id')
    @UseGuards(PermissionGuard(Permission.Profile.UPDATE))
    async updateOne(
        @Param('id') id:number,
        @Body() updateProfile:UpdateProfileDto
    ){
        return this.profileService.updateProfile(id,updateProfile)[0];
    }
    @Delete(':id')
    @UseGuards(PermissionGuard(Permission.Profile.REMOVE))
    async deleteOne(
        @Param('id') id:number
    ){
        return this.profileService.deleteProfile(id)
    }
}