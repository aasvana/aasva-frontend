"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  FileWarning,
  KeyRound,
  Layers,
  ListChecks,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AuditLogEntry,
  useAuditLogStore,
} from "@/stores/auditStore";
import { useSecurityStore } from "@/stores/securityStore";
import { useApprovalStore } from "@/stores/approvalStore";
import {
  StatCard,
  actionBadge,
  formatTime,
  moduleBadge,
} from "@/components/auditing/audit-ui";
import { useClientReady } from "@/hooks/useClientReady";

export default function AuditingOverviewPage() {
  const router = useRouter();
  const entries = useAuditLogStore((s) => s.entries);
  const loginEvents = useSecurityStore((s) => s.loginEvents);
  const sessions = useSecurityStore((s) => s.sessions);
  const approvals = useApprovalStore((s) => s.approvals);

  const stats = useMemo(() => {
    const now = Date.now();
    const today = entries.filter(
      (e) => now - new Date(e.timestamp).getTime() < 864e5
    ).length;
    const failedLogins = loginEvents.filter(
      (e) => e.status === "failed"
    ).length;
    const activeSessions = sessions.filter((s) => s.status === "active").length;
    const pendingApprovals = approvals.filter(
      (a) => a.status === "Pending"
    ).length;
    const dataChanges = entries.filter(
      (e) =>
        e.action === "created" ||
        e.action === "updated" ||
        e.action === "deleted" ||
        e.action === "restored"
    ).length;
    const financial = entries.filter((e) => e.module === "Finance").length;
    const inventory = entries.filter((e) => e.module === "Inventory").length;
    return {
      today,
      failedLogins,
      activeSessions,
      pendingApprovals,
      dataChanges,
      financial,
      inventory,
    };
  }, [entries, loginEvents, sessions, approvals]);

  const recent = useMemo(
    () => [...entries].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 8),
    [entries]
  );
  const pending = useMemo(
    () => approvals.filter((a) => a.status === "Pending"),
    [approvals]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Auditing</h1>
          <p className="text-sm text-gray-500">
            A live overview of security, data changes and approvals.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/auditing/activity-log")}>
          <Activity /> View Activity Log
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Activities today"
          value={stats.today}
          icon={<Activity className="size-4" />}
        />
        <StatCard
          label="Failed logins"
          value={stats.failedLogins}
          icon={<ShieldAlert className="size-4" />}
          tone="red"
        />
        <StatCard
          label="Active sessions"
          value={stats.activeSessions}
          icon={<ShieldCheck className="size-4" />}
          tone="sky"
        />
        <StatCard
          label="Pending approvals"
          value={stats.pendingApprovals}
          icon={<ListChecks className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Data changes"
          value={stats.dataChanges}
          icon={<Layers className="size-4" />}
          tone="violet"
        />
        <StatCard
          label="Financial changes"
          value={stats.financial}
          icon={<KeyRound className="size-4" />}
        />
        <StatCard
          label="Inventory changes"
          value={stats.inventory}
          icon={<Layers className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Security events"
          value={entries.filter((e) => e.module === "Security").length}
          icon={<UserCheck className="size-4" />}
          tone="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 p-1.5 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Recent activity
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/auditing/audit-trail")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              Audit trail <ArrowRight className="size-3.5" />
            </button>
          </div>
          <div className="mt-3 divide-y divide-gray-100">
            {recent.map((entry: AuditLogEntry) => (
              <div key={entry.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {actionBadge(entry.action)}
                    {moduleBadge(entry.module)}
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-600">
                    {entry.details}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Pending approvals
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/auditing/approval-history")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              Approval history <ArrowRight className="size-3.5" />
            </button>
          </div>
          {pending.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <FileWarning className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">
                No pending approvals right now.
              </p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {pending.slice(0, 5).map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {approval.documentType} · {approval.documentNo}
                    </p>
                    <p className="text-xs text-gray-400">
                      {approval.submittedBy} → {approval.reviewer}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {approval.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        {[
          {
            label: "Login History",
            description: "Successful logins & logouts",
            url: "/dashboard/auditing/login-history",
          },
          {
            label: "Failed Logins",
            description: "Security threats & lockouts",
            url: "/dashboard/auditing/failed-logins",
          },
          {
            label: "Stock Changes",
            description: "Adjustments & transfers",
            url: "/dashboard/auditing/stock-changes",
          },
          {
            label: "Export & Reports",
            description: "Download audit reports",
            url: "/dashboard/auditing/export-reports",
          },
        ].map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => router.push(action.url)}
            className="group flex cursor-pointer flex-col items-start gap-3 rounded-[20px] border border-gray-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
          >
            <Activity className="size-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {action.label}
              </p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
