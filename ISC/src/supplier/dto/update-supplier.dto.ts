

import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SupplierEntity } from '../entities/supplier.entity';

export class UpdateSupplierDto extends OmitType(SupplierEntity,['supplier_id']) {
    @ApiProperty()
    supplier_abbreviation: string;

    @ApiProperty()
    supplier_codigo: string;
    
    @ApiProperty()
    supplier_name: string;

}
