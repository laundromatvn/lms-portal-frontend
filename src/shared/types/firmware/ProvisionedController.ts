import { ControllerStatusEnum } from "@shared/enums/ControllerStatusEnum";

export type ProvisionedController = {
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
}
