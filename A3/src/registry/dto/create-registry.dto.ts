import { ApiProperty, OmitType } from '@nestjs/swagger';
import { a3_registryEntity } from '../entities/a3_registry.entity';

export class CreateA3_RegistryDto extends OmitType(a3_registryEntity,['a3_registry_id', 'a3_registry_createad']){

    @ApiProperty()
    a3_registry_name: string;

    @ApiProperty()
    a3_registry_description: string;

    @ApiProperty()
    a3_registry_user: string;
}