"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCheck,
  Clock3,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchNotifications,
  listenForegroundNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  requestNotificationPermission,
} from "@/services/notification/notification.service";
import { Notification, NotificationType, ReceiverRole } from "@/types/notification";
import "@/styles/notification/NotificationBell.css";

type Variant = "light" | "dark";

interface NotificationBellProps {
  variant?: Variant;
}

const typeMeta: Record<
  NotificationType,
  { label: string; icon: ReactNode; tone: string }
> = {
  JOB_POSTED: {
    label: "Job posted",
    icon: <BriefcaseBusiness size={18} />,
    tone: "green",
  },
  APPLICATION_STATUS_CHANGED: {
    label: "Application update",
    icon: <FileText size={18} />,
    tone: "blue",
  },
  SAVED_JOB_EXPIRING: {
    label: "Saved job expiring",
    icon: <Clock3 size={18} />,
    tone: "orange",
  },
  SAVED_JOB_EXPIRED: {
    label: "Saved job expired",
    icon: <Clock3 size={18} />,
    tone: "red",
  },
  SAVED_JOB_CLOSED: {
    label: "Saved job closed",
    icon: <BriefcaseBusiness size={18} />,
    tone: "red",
  },
  APPLICATION_SUBMITTED: {
    label: "New application",
    icon: <FileText size={18} />,
    tone: "green",
  },
  JOB_EXPIRED: {
    label: "Job expired",
    icon: <Clock3 size={18} />,
    tone: "orange",
  },
  COMPANY_VERIFICATION: {
    label: "Company verification",
    icon: <Building2 size={18} />,
    tone: "blue",
  },
};

const getNotificationUrl = (notification: Notification, role?: ReceiverRole | string) => {
  const id = notification.relatedId;
  const normalizedRole = role?.toUpperCase();

  switch (notification.type) {
    case "JOB_POSTED":
      return id ? `/candidate/jobs/${id}` : "/candidate/jobs";

    case "APPLICATION_STATUS_CHANGED":
      return id ? `/candidate/jobs/applied?applicationId=${id}` : "/candidate/jobs/applied";

    case "SAVED_JOB_EXPIRING":
    case "SAVED_JOB_EXPIRED":
    case "SAVED_JOB_CLOSED":
      return id ? `/candidate/jobs/${id}` : "/candidate/jobs/saved";

    case "APPLICATION_SUBMITTED":
      return id ? `/recruiter/application?applicationId=${id}` : "/recruiter/application";

    case "JOB_EXPIRED":
      return id ? `/recruiter/jobs/edit/${id}` : "/recruiter/jobs";

    case "COMPANY_VERIFICATION":
      if (normalizedRole === "ADMIN") {
        return id ? `/admin/company?companyId=${id}` : "/admin/company";
      }
      return "/recruiter/company/verify";

    default:
      return normalizedRole === "RECRUITER" ? "/recruiter" : "/candidate";
  }
};

const formatTime = (date: string) => {
  const createdAt = new Date(date).getTime();
  if (Number.isNaN(createdAt)) return "";

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - createdAt) / 1000));
  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  return new Date(date).toLocaleDateString("en-US");
};

export default function NotificationBell({ variant = "light" }: NotificationBellProps) {
  const auth = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const role = auth?.user?.roles?.[0];
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  useEffect(() => {
    if (!auth?.token) return;

    let unsubscribe = () => {};
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        console.log(auth?.user);
        const userId = auth?.user?.userId;
        const data = await fetchNotifications(userId);
        if (mounted) setNotifications(data);
      } catch (error) {
        console.error("Fetch notifications error:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const listen = async () => {
      unsubscribe = await listenForegroundNotifications((notification) => {
        setNotifications((prev) => {
          const exists = prev.some((item) => item.id === notification.id);
          return exists ? prev : [notification, ...prev];
        });
      });
    };

    load();
    listen();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [auth?.token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEnableNotifications = async () => {
    setPermissionLoading(true);
    try {
      await requestNotificationPermission(auth?.user?.userId);
    } catch (error) {
      console.error("Request notification permission error:", error);
    } finally {
      setPermissionLoading(false);
    }
  };

  const handleOpenNotification = async (notification: Notification) => {
    setOpen(false);
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item
      )
    );

    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (error) {
        console.error("Mark notification read error:", error);
      }
    }

    router.push(getNotificationUrl(notification, role));
  };

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;

    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));

    try {
      await markAllNotificationsAsRead(auth?.user?.userId);
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    }
  };

  return (
    <div
      className={`notification-root notification-root--${variant}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className="notification-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-panel__header">
            <div>
              <p>Notifications</p>
              <span>{unreadCount} unread updates</span>
            </div>
            <button
              type="button"
              className="notification-mark-all"
              onClick={handleMarkAllRead}
              disabled={!unreadCount}
              title="Mark all as read"
            >
              <CheckCheck size={17} />
            </button>
          </div>

          <div className="notification-enable">
            <div className="notification-enable__icon">
              <ShieldCheck size={17} />
            </div>
            <div>
              <p>Realtime alerts</p>
              <span>Enable browser notifications for instant updates.</span>
            </div>
            <button
              type="button"
              onClick={handleEnableNotifications}
              disabled={permissionLoading}
            >
              {permissionLoading ? "..." : "Enable"}
            </button>
          </div>

          <div className="notification-list">
            {loading && (
              <div className="notification-empty">
                <Sparkles size={20} />
                <p>Loading notifications...</p>
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="notification-empty">
                <Sparkles size={20} />
                <p>No notifications yet</p>
                <span>Fresh career updates will appear here.</span>
              </div>
            )}

            {!loading &&
              notifications.map((notification) => {
                const meta = typeMeta[notification.type] ?? typeMeta.JOB_POSTED;

                return (
                  <button
                    type="button"
                    key={notification.id}
                    className={`notification-item ${
                      notification.isRead ? "" : "notification-item--unread"
                    }`}
                    onClick={() => handleOpenNotification(notification)}
                  >
                    <span
                      className={`notification-item__icon notification-item__icon--${meta.tone}`}
                    >
                      {meta.icon}
                    </span>

                    <span className="notification-item__body">
                      <span className="notification-item__top">
                        <strong>{notification.title}</strong>
                        {!notification.isRead && <i />}
                      </span>
                      <span className="notification-item__message">
                        {notification.message}
                      </span>
                      <span className="notification-item__meta">
                        {meta.label} · {formatTime(notification.createdAt)}
                      </span>
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
