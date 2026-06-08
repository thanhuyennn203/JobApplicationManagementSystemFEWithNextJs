"use client";

import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  XCircle,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import "@/styles/notification/Toast.css";

export type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
};

type ToastOptions = {
  title?: string;
  duration?: number;
};

type ToastContextValue = {
  showToast: (type: ToastType, message: string, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toastMeta: Record<ToastType, { title: string; icon: ReactNode }> = {
  success: {
    title: "Success",
    icon: <CheckCircle size={22} />,
  },
  error: {
    title: "Error",
    icon: <XCircle size={22} />,
  },
  warning: {
    title: "Warning",
    icon: <AlertTriangle size={22} />,
  },
  info: {
    title: "Info",
    icon: <Info size={22} />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const id = Date.now() + Math.random();

      setToasts((current) =>
        [
          {
            id,
            type,
            title: options?.title || toastMeta[type].title,
            message,
          },
          ...current,
        ].slice(0, 5)
      );

      window.setTimeout(() => {
        dismissToast(id);
      }, options?.duration ?? 4000);
    },
    [dismissToast]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      success: (message, options) => showToast("success", message, options),
      error: (message, options) => showToast("error", message, options),
      warning: (message, options) => showToast("warning", message, options),
      info: (message, options) => showToast("info", message, options),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <div className="toast__icon">{toastMeta[toast.type].icon}</div>
            <div className="toast__content">
              <p className="toast__title">{toast.title}</p>
              {toast.message && <p className="toast__message">{toast.message}</p>}
            </div>
            <button
              type="button"
              className="toast__close"
              aria-label="Close notification"
              onClick={() => dismissToast(toast.id)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
