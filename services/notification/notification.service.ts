import { getToken, MessagePayload, onMessage } from "firebase/messaging";
import { Notification } from "@/types/notification";
import { getFirebaseMessaging } from "./firebase";

const API_URL = "http://localhost:9191/api/notifications";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

const normalizeNotifications = (data: unknown): Notification[] => {
    if (Array.isArray(data)) return data as Notification[];

    if (data && typeof data === "object") {
        const candidate = data as {
            data?: unknown;
            content?: unknown;
            items?: unknown;
            notifications?: unknown;
        };

        if (Array.isArray(candidate.data)) return candidate.data as Notification[];
        if (Array.isArray(candidate.content)) return candidate.content as Notification[];
        if (Array.isArray(candidate.items)) return candidate.items as Notification[];
        if (Array.isArray(candidate.notifications)) {
            return candidate.notifications as Notification[];
        }
    }

    return [];
};

export async function requestNotificationPermission(userId: number) {
    if (typeof window === "undefined" || !("Notification" in window)) {
        return null;
    }

    const permission = await window.Notification.requestPermission();

    if (permission !== "granted") {
        return null;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
        await saveNotificationToken(userId, token);
    }

    return token;
}

export const saveNotificationToken = async (userId: number, fcmToken: string) => {
    const res = await fetch(`${API_URL}/fcm-tokens`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ userId, token: fcmToken }),
    });

    if (!res.ok) {
        throw new Error("Failed to save notification token");
    }

    return res.text();
};

export const fetchNotifications = async (userId: number): Promise<Notification[]> => {
    console.log("data call: ", userId);
    const res = await fetch(`${API_URL}/${userId}`, {
        cache: "no-store",
        headers: getAuthHeader(),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch notifications");
    }

    const data = await res.json();
    return normalizeNotifications(data);
};

export const markNotificationAsRead = async (notificationId: number) => {
    const res = await fetch(`${API_URL}/${notificationId}/read`, {
        method: "PUT",
        headers: getAuthHeader(),
    });

    if (!res.ok) {
        throw new Error("Failed to mark notification as read");
    }

    if (res.status === 204) return null;

    const text = await res.text();
    return text ? JSON.parse(text) : null;
};

export const markAllNotificationsAsRead = async (userId : number) => {
    const res = await fetch(`${API_URL}/${userId}/all-read`, {
        method: "PUT",
        headers: getAuthHeader(),
    });

    if (!res.ok) {
        throw new Error("Failed to mark notifications as read");
    }

    return res.status === 204 ? null : res.text();
};

export const listenForegroundNotifications = async (
    callback: (notification: Notification) => void
) => {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return () => undefined;

    return onMessage(messaging, (payload: MessagePayload) => {
        const data = payload.data ?? {};

        callback({
            id: Number(data.id ?? Date.now()),
            senderId: data.senderId ? Number(data.senderId) : null,
            senderType: (data.senderType ?? "SYSTEM") as Notification["senderType"],
            receiverUserId: data.receiverUserId ? Number(data.receiverUserId) : 0,
            receiverRole: (data.receiverRole ?? "CANDIDATE") as Notification["receiverRole"],
            title: data.title ?? payload.notification?.title ?? "New notification",
            message: data.message ?? payload.notification?.body ?? "",
            type: data.type as Notification["type"],
            relatedId: data.relatedId ? Number(data.relatedId) : null,
            isRead: false,
            createdAt: data.createdAt ?? new Date().toISOString(),
        });
    });
};
