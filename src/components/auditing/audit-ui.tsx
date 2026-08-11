"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { AuditLogEntry } from "@/stores/auditStore";

const ACTION_STYLES: Record<string, string> = {
  created: "bg-emerald-50 text-emerald-700",
  updated: "bg-blue-50 text-blue-700",
  deleted: "bg-red-50 text-red-700",
  restored: "bg-violet-50 text-violet-700",
  posted: "bg-sky-50 text-sky-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  accepted: "bg-emerald-50 text-emerald-700",
  converted: "bg-violet-50 text-violet-700",
  sent: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700",
  revoked: "bg-amber-50 text-amber-700",
  login: "bg-emerald-50 text-emerald-700",
  logout: "bg-gray-100 text-gray-600",
  failed_login: "bg-red-50 text-red-700",
  exported: "bg-cyan-50 text-cyan-700",
};

export function actionBadge(action: string) {
  const key = action.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        ACTION_STYLES[key] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {action.replace("_", " ")}
    </span>
  );
}

const MODULE_STYLES: Record<string, string> = {
  finance: "bg-emerald-50 text-emerald-700",
  inventory: "bg-amber-50 text-amber-700",
  security: "bg-red-50 text-red-700",
  sales: "bg-blue-50 text-blue-700",
  system: "bg-gray-100 text-gray-600",
  delivery: "bg-cyan-50 text-cyan-700",
};

export function moduleBadge(module: string) {
  const key = module.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        MODULE_STYLES[key] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {module}
    </span>
  );
}

export function severityBadge(severity: string) {
  const styles: Record<string, string> = {
    info: "bg-sky-50 text-sky-700",
    warning: "bg-amber-50 text-amber-700",
    critical: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        styles[severity] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {severity}
    </span>
  );
}

export function formatTime(timestamp: string) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(timestamp: string) {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: "default" | "amber" | "red" | "sky" | "violet";
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div
          className={cn(
            "grid size-8 place-items-center rounded-full",
            tone === "amber" && "bg-amber-50 text-amber-600",
            tone === "red" && "bg-red-50 text-red-600",
            tone === "sky" && "bg-sky-50 text-sky-600",
            tone === "violet" && "bg-violet-50 text-violet-600",
            tone === "default" && "bg-emerald-50 text-emerald-600"
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SelectFilter({
  value,
  onChange,
  options,
  allLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
    >
      <option value="all">{allLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export type AuditTableProps = {
  title: string;
  description: string;
  entries: AuditLogEntry[];
  emptyTitle: string;
  emptyDescription: string;
  icon?: React.ComponentType<{ className?: string }>;
  showActor?: boolean;
  defaultSeverity?: string;
  tableHeaders?: string[];
};

export function AuditTable({
  title,
  description,
  entries,
  emptyTitle,
  emptyDescription,
  icon: Icon,
  showActor = true,
  defaultSeverity = "all",
  tableHeaders = [
    "timestamp",
    "action",
    "module",
    "entity / reference",
    "details",
    "severity",
  ],
}: AuditTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState(defaultSeverity);

  const actions = useMemo(
    () => Array.from(new Set(entries.map((e) => e.action))).sort(),
    [entries]
  );
  const modules = useMemo(
    () => Array.from(new Set(entries.map((e) => e.module))).sort(),
    [entries]
  );

  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return entries.filter((entry) => {
      if (actionFilter !== "all" && entry.action !== actionFilter) return false;
      if (moduleFilter !== "all" && entry.module !== moduleFilter) return false;
      if (severityFilter !== "all" && entry.severity !== severityFilter)
        return false;
      if (!query) return true;
      return `${entry.entity} ${entry.ref} ${entry.actor} ${entry.details}`
        .toLowerCase()
        .includes(query);
    });
  }, [entries, searchTerm, actionFilter, moduleFilter, severityFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="flex flex-col p-1.5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-100 rounded-[20px] divide-y divide-gray-100 dark:border-neutral-700 dark:divide-neutral-700">
              <div className="flex flex-wrap items-center gap-2 py-3 px-4">
                <div className="relative w-lg max-w-sm">
                  <label className="sr-only">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search activity..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 ps-9 pe-3 block text-sm shadow-2xs outline-none transition-[color,box-shadow] focus-visible:border-emerald-400 focus-visible:ring-emerald-100 focus-visible:ring-[3px]"
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                </div>
                <SelectFilter
                  value={actionFilter}
                  onChange={setActionFilter}
                  allLabel="All actions"
                  options={actions.map((a) => ({
                    value: a,
                    label: a.replace("_", " "),
                  }))}
                />
                <SelectFilter
                  value={moduleFilter}
                  onChange={setModuleFilter}
                  allLabel="All modules"
                  options={modules.map((m) => ({ value: m, label: m }))}
                />
                <SelectFilter
                  value={severityFilter}
                  onChange={setSeverityFilter}
                  allLabel="All severities"
                  options={[
                    { value: "info", label: "Info" },
                    { value: "warning", label: "Warning" },
                    { value: "critical", label: "Critical" },
                  ]}
                />
              </div>
              <div className="overflow-hidden min-h-[300px]">
                {entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    {Icon && <Icon className="size-10 text-gray-300" />}
                    <p className="text-lg font-medium text-gray-800">
                      {emptyTitle}
                    </p>
                    <p className="text-sm text-gray-500">{emptyDescription}</p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 h-[300px] text-center">
                    <p className="text-lg font-medium text-gray-800">
                      No results found
                    </p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search or filters.
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        {tableHeaders.map((header, idx) => (
                          <th
                            key={idx}
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {filtered.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                            {formatTime(entry.timestamp)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            {actionBadge(entry.action)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            {moduleBadge(entry.module)}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            <span className="font-medium text-gray-800 dark:text-neutral-200">
                              {entry.entity}
                            </span>
                            <span className="text-gray-400"> · </span>
                            <span className="text-gray-600 dark:text-neutral-300">
                              {entry.ref}
                            </span>
                          </td>
                          {showActor && (
                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                              {entry.actor}
                            </td>
                          )}
                          <td className="px-6 py-2.5 min-w-[220px] text-sm text-gray-600 dark:text-neutral-300">
                            {entry.details}
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm">
                            {severityBadge(entry.severity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (value: string | number) => {
    const text = String(value);
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  };
  const csv = [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
