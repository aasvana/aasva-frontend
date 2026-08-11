"use client";

import { cn } from "@/lib/utils";
import { useAuditLogStore } from "@/stores/auditStore";
import type { AuditAction } from "@/stores/auditStore";

const STATUS_TONES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  "ready for dispatch": "bg-sky-50 text-sky-700",
  dispatched: "bg-indigo-50 text-indigo-700",
  "in transit": "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export function deliveryStatusPill(status: string) {
  const key = status.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_TONES[key] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {status}
    </span>
  );
}

export function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  tone?: "default" | "sky" | "violet" | "amber";
}) {
  const tones = {
    default: "bg-emerald-50 text-emerald-700",
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
  } as const;
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <span
          className={cn(
            "grid size-8 place-items-center rounded-xl",
            tones[tone]
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}

export function logDeliveryAction(
  action: AuditAction,
  entity: string,
  ref: string,
  details: string
) {
  useAuditLogStore.getState().addEntry({
    action,
    module: "Delivery",
    category: "Delivery",
    entity,
    ref,
    actor: "Admin",
    timestamp: new Date().toISOString(),
    details,
    severity: action === "deleted" ? "warning" : "info",
  });
}
