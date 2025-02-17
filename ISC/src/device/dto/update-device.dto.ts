import { ApiProperty, OmitType } from "@nestjs/swagger";
import { DeviceEntity } from "../entities/device.entity";

export class UpdateDeviceDto extends OmitType(DeviceEntity, ['device_id', 'device_create_date', 'device_create_user', 'device_update_date']) {

    @ApiProperty()
    device_name: string;

    @ApiProperty()
    device_status: boolean;

    @ApiProperty()
    device_update_user: string;

    @ApiProperty()
    registration_line_id: number;
}