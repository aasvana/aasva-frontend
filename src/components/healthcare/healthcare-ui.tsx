"use client";

import Link from "next/link";
import {
  Activity,
  Briefcase,
  Calendar,
  CalendarClock,
  ClipboardList,
  Eye,
  FlaskConical,
  FolderOpen,
  ListOrdered,
  Pill,
  Receipt,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function HealthcareStatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  tone?: "default" | "sky" | "violet" | "amber" | "rose" | "teal";
}) {
  const tones = {
    default: "bg-emerald-50 text-emerald-700",
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    teal: "bg-teal-50 text-teal-700",
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

const APPOINTMENT_TONES: Record<string, string> = {
  Scheduled: "bg-sky-50 text-sky-700",
  "In Progress": "bg-violet-50 text-violet-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const QUEUE_TONES: Record<string, string> = {
  Waiting: "bg-amber-50 text-amber-700",
  "In Consultation": "bg-violet-50 text-violet-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

const PRIORITY_TONES: Record<string, string> = {
  Normal: "bg-sky-50 text-sky-700",
  Urgent: "bg-amber-50 text-amber-700",
  Critical: "bg-rose-50 text-rose-700",
};

const BILLING_TONES: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Overdue: "bg-rose-50 text-rose-700",
};

const STAFF_TONES: Record<string, string> = {
  "On Duty": "bg-emerald-50 text-emerald-700",
  "Off Duty": "bg-gray-100 text-gray-600",
  "On Leave": "bg-amber-50 text-amber-700",
};

export function appointmentPill(status: string) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        APPOINTMENT_TONES[status] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {status}
    </span>
  );
}

export function queuePill(status: string) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        QUEUE_TONES[status] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {status}
    </span>
  );
}

export function priorityPill(priority: string) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        PRIORITY_TONES[priority] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {priority}
    </span>
  );
}

export function billingPill(status: string) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        BILLING_TONES[status] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {status}
    </span>
  );
}

export function staffPill(status: string) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STAFF_TONES[status] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {status}
    </span>
  );
}

export type HealthcareQuickLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  tone: string;
};

export const HEALTHCARE_QUICK_LINKS: HealthcareQuickLink[] = [
  { label: "Overview", href: "/dashboard/healthcare/overview", icon: Eye, tone: "bg-emerald-50 text-emerald-700" },
  { label: "Patients", href: "/dashboard/healthcare/patients", icon: Users, tone: "bg-sky-50 text-sky-700" },
  { label: "Appointments", href: "/dashboard/healthcare/appointments", icon: Calendar, tone: "bg-violet-50 text-violet-700" },
  { label: "Queue", href: "/dashboard/healthcare/queue", icon: ListOrdered, tone: "bg-amber-50 text-amber-700" },
  { label: "Consultations", href: "/dashboard/healthcare/consultations", icon: Stethoscope, tone: "bg-rose-50 text-rose-700" },
  { label: "Medical Records", href: "/dashboard/healthcare/medical-records", icon: FolderOpen, tone: "bg-sky-50 text-sky-700" },
  { label: "Prescriptions", href: "/dashboard/healthcare/prescriptions", icon: Pill, tone: "bg-emerald-50 text-emerald-700" },
  { label: "Investigations", href: "/dashboard/healthcare/investigations", icon: FlaskConical, tone: "bg-violet-50 text-violet-700" },
  { label: "Treatments", href: "/dashboard/healthcare/treatments", icon: Activity, tone: "bg-amber-50 text-amber-700" },
  { label: "Follow-ups", href: "/dashboard/healthcare/follow-ups", icon: CalendarClock, tone: "bg-rose-50 text-rose-700" },
  { label: "Billing", href: "/dashboard/healthcare/billing", icon: Receipt, tone: "bg-amber-50 text-amber-700" },
  { label: "Pharmacy", href: "/dashboard/healthcare/pharmacy", icon: Pill, tone: "bg-teal-50 text-teal-700" },
  { label: "Staff", href: "/dashboard/healthcare/staff", icon: Briefcase, tone: "bg-indigo-50 text-indigo-700" },
  { label: "Reports", href: "/dashboard/healthcare/reports", icon: ClipboardList, tone: "bg-cyan-50 text-cyan-700" },
  { label: "Settings", href: "/dashboard/healthcare/settings", icon: Settings, tone: "bg-gray-100 text-gray-600" },
];

export function HealthcarePlaceholder({
  title,
  description,
  backHref,
  backLabel,
}: {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-xs">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="rounded-[20px] border border-dashed border-gray-200 bg-white p-10 text-center shadow-xs">
        <p className="text-sm font-semibold text-gray-700">Coming in a future chunk</p>
        <p className="mt-1 text-xs text-gray-500">
          This section is scaffolded. Detailed UI and data flows will land in a
          follow-up chunk.
        </p>
        {backHref && (
          <Link
            href={backHref}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            {backLabel ?? "Back to Healthcare Overview"}
          </Link>
        )}
      </div>
    </div>
  );
}
