import { SystemTaskTypeEnum } from "@shared/enums/SystemTaskTypeEnum";
import { SystemTaskStatusEnum } from "@shared/enums/SystemTaskStatusEnum";

export type SystemTask = {
    id: string,
    created_at: string,
    updated_at: string,
    status: SystemTaskStatusEnum,
    type: SystemTaskTypeEnum,
    expires_in: number,
    expires_at: string,
    data: any | null
}
