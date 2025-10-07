import { AuthSessionStatusEnum } from "@shared/enums/AuthSessionStatusEnum";

export type AuthSession = {
    id: string,
    created_at: string,
    updated_at: string,
    status: AuthSessionStatusEnum,
    expires_in: number,
    expires_at: string,
    data: any | null
}
