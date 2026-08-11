"use client";

import { cn } from "@/lib/utils";

const STATUS_TONES: Record<string, string> = {
  New: "bg-blue-50 text-blue-600",
  Quoted: "bg-violet-50 text-violet-600",
  Confirmed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Draft: "bg-gray-100 text-gray-600",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-600",
  Lost: "bg-red-50 text-red-600",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_TONES[status] ?? "bg-gray-100 text-gray-600",
        className
      )}
    >
      {status}
    </span>
  );
}
