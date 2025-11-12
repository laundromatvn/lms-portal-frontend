import { ControllerStatusEnum } from "@shared/enums/ControllerStatusEnum";
import { FirmwareDeploymentStatusEnum } from "@shared/enums/FirmwareDeploymentStatusEnum";


export type ProvisioningController = {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    status: ControllerStatusEnum;
    device_id: string;
    name: string | null;
    store_id: string | null;
    store_name: string | null;
    tenant_id: string | null;
    tenant_name: string | null;
    firmware_id: string | null;
    firmware_name: string | null;
    firmware_version: string | null;
    deployment_id: string | null;
    deployment_status: FirmwareDeploymentStatusEnum | null;
}
