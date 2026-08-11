"use client";

import { cn } from "@/lib/utils";
import { useAuditLogStore } from "@/stores/auditStore";
import type { AuditAction } from "@/stores/auditStore";
import { REQUEST_CATEGORY_LABELS, RequestCategory } from "@/stores/userRequestStore";

const CATEGORY_TONES: Record<string, string> = {
  support: "bg-sky-50 text-sky-700",
  feature: "bg-violet-50 text-violet-700",
  feedback: "bg-teal-50 text-teal-700",
  bug: "bg-red-50 text-red-700",
  complaint: "bg-amber-50 text-amber-700",
  announcement: "bg-indigo-50 text-indigo-700",
};

export function categoryBadge(category: RequestCategory) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        CATEGORY_TONES[category] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {REQUEST_CATEGORY_LABELS[category]}
    </span>
  );
}

const PRIORITY_TONES: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-sky-50 text-sky-700",
  high: "bg-amber-50 text-amber-700",
  urgent: "bg-red-50 text-red-700",
};

export function priorityPill(priority: string) {
  const key = priority.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        PRIORITY_TONES[key] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {priority}
    </span>
  );
}

const STATUS_TONES: Record<string, string> = {
  open: "bg-sky-50 text-sky-700",
  "in progress": "bg-amber-50 text-amber-700",
  resolved: "bg-emerald-50 text-emerald-700",
  closed: "bg-gray-100 text-gray-600",
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-gray-100 text-gray-600",
};

export function statusPill(status: string) {
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
        <span className={cn("grid size-8 place-items-center rounded-xl", tones[tone])}>
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}

export function logRequestAction(
  action: AuditAction,
  entity: string,
  ref: string,
  details: string
) {
  useAuditLogStore.getState().addEntry({
    action,
    module: "System",
    category: "Request",
    entity,
    ref,
    actor: "Admin",
    timestamp: new Date().toISOString(),
    details,
    severity: action === "deleted" ? "warning" : "info",
  });
}
