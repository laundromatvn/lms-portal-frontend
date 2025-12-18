import { NotificationTypeEnum } from "@shared/enums/NotificationTypeEnum";
import { NotificationStatusEnum } from "@shared/enums/NotificationStatusEnum";

export type Notification = {
    id: string;
    created_at: string;
    seen_at: string | null;
    type: NotificationTypeEnum;
    status: NotificationStatusEnum;
    title: string;
    message: string;
}
