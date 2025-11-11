import { FirmwareStatusEnum } from "@shared/enums/FirmwareStatusEnum";
import { FirmwareVersionTypeEnum } from "@shared/enums/FirmwareVersionTypeEnum";

export type Firmware = {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    created_by: string;
    updated_by: string;
    deleted_by: string | null;
    name: string;
    version: string;
    description: string | null;
    status: FirmwareStatusEnum;
    version_type: FirmwareVersionTypeEnum;
    object_name: string;
    file_size: number;
    checksum: string;
}
