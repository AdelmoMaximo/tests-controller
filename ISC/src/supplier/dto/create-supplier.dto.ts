import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {


  @ApiProperty()
  supplier_codigo: string;

  @ApiProperty()
  supplier_abbreviation: string;

  @ApiProperty()
  supplier_name: string;
}
