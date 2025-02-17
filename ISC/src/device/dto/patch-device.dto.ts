import { ApiProperty, OmitType } from "@nestjs/swagger";
import { DeviceEntity } from "../entities/device.entity";

export class PatchDeviceDto extends OmitType(DeviceEntity,['device_id','registration_line_id','device_name','phase_line','device_create_date','device_update_date','device_create_user','device_update_user']) {
    @ApiProperty()
    device_status: boolean;
}