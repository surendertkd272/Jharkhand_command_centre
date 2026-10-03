"use client";

import * as React from "react";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "info" | "danger";

interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
}

interface ToastItem extends Required<Pick<ToastInput, "title" | "tone">> {
  id: number;
  description?: string;
}

const TONE: Record<ToastTone, { icon: typeof Info; iconClass: string }> = {
  success: { icon: CheckCircle2, iconClass: "bg-tint-green text-ok" },
  info: { icon: Info, iconClass: "bg-tint-blue text-info" },
  danger: { icon: AlertTriangle, iconClass: "bg-tint-red text-danger" },
};

const DISMISS_MS = 3500;

const ToastContext = React.createContext<(t: ToastInput) => void>(() => {});

/** Fire a confirmation toast. Mounted once in the root layout. */
export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const nextId = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ title, description, tone = "success" }: ToastInput) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { id, title, description, tone }]);
      window.setTimeout(() => dismiss(id), DISMISS_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2"
      >
        {toasts.map((t) => {
          const { icon: Icon, iconClass } = TONE[t.tone];
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-line bg-card p-3.5 shadow-lift animate-fade-in"
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                  iconClass,
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-900">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-muted">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted hover:bg-black/5 hover:text-ink-900"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
