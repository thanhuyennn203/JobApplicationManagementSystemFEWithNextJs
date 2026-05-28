export type SenderType =
    | "SYSTEM"
    | "COMPANY"
    | "CANDIDATE";

export type ReceiverRole =
    | "CANDIDATE"
    | "RECRUITER"
    | "ADMIN";

export type NotificationType =
    |"JOB_POSTED"
    "APPLICATION_STATUS_CHANGED"
    "SAVED_JOB_EXPIRING"
    "SAVED_JOB_EXPIRED"
    "SAVED_JOB_CLOSED"
    "APPLICATION_SUBMITTED"
    "JOB_EXPIRED"
    "COMPANY_VERIFICATION";

export interface Notification {

    id: number;

    senderId: number | null;

    senderType: SenderType;

    receiverUserId: number;

    receiverRole: ReceiverRole;

    title: string;

    message: string;

    type: NotificationType;

    relatedId: number | null;

    isRead: boolean;

    createdAt: string;
}