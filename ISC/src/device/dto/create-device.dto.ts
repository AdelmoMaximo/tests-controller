import { ApiProperty, OmitType } from "@nestjs/swagger";
import { DeviceEntity } from "../entities/device.entity";

export class CreateDeviceDto extends OmitType(DeviceEntity, ['device_id','device_create_date', 'device_update_date', 'device_update_user']) {
  @ApiProperty()
  device_name: string;

  @ApiProperty()
  device_status: boolean;

  @ApiProperty()
  device_create_user: string;

  @ApiProperty()
  registration_line_id: number;
}