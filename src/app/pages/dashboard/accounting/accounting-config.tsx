"use client";

import { cn } from "@/lib/utils";

export const STATUS_OPTIONS = [
  "Draft",
  "Sent",
  "Issued",
  "Accepted",
  "Rejected",
  "Converted",
  "Applied",
  "Paid",
  "Pending",
  "Received",
  "Approved",
  "Reimbursed",
] as const;

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-blue-50 text-blue-700",
  issued: "bg-blue-50 text-blue-700",
  accepted: "bg-emerald-50 text-emerald-700",
  converted: "bg-violet-50 text-violet-700",
  applied: "bg-emerald-50 text-emerald-700",
  paid: "bg-emerald-50 text-emerald-700",
  received: "bg-emerald-50 text-emerald-700",
  approved: "bg-emerald-50 text-emerald-700",
  reimbursed: "bg-blue-50 text-blue-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-700",
};

export function statusBadge(status: string) {
  const key = status.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_STYLES[key] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {status || "—"}
    </span>
  );
}
